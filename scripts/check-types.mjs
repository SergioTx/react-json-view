import { relative, resolve } from 'node:path';
import {
  isBindingElement,
  isCallExpression,
  isElementAccessExpression,
  isIdentifier,
  isNewExpression,
  isParameterDeclaration,
  isPropertyAccessExpression,
  isReturnStatement,
  isVariableDeclaration,
  SyntaxKind,
} from 'typescript/unstable/ast';
import { API, TypeFlags } from 'typescript/unstable/sync';

const api = new API({ cwd: process.cwd() });
const config = resolve('tsconfig.json');
const snapshot = api.updateSnapshot({ openProjects: [config] });
try {
  const project = snapshot.getProject(config);
  if (!project) {
    throw new Error('TypeScript project could not be loaded');
  }
  const { checker, program } = project;
  let failures = 0;

  /**
   * @param {import('typescript/unstable/sync').Type | undefined} type
   * @param {Set<number>} [seen]
   * @returns {boolean}
   */
  function containsAny(type, seen = new Set()) {
    if (!type || seen.has(type.id)) {
      return false;
    }
    seen.add(type.id);
    if (type.flags & TypeFlags.Any) {
      return true;
    }
    if (type.isUnionType() || type.isIntersectionType()) {
      return type.getTypes().some((part) => containsAny(part, seen));
    }
    if (!type.isTypeReference()) {
      return false;
    }
    const name = type.getTarget().getSymbol()?.name;
    return (
      [
        'Array',
        'ReadonlyArray',
        'Map',
        'ReadonlyMap',
        'Set',
        'ReadonlySet',
        'Promise',
      ].includes(name ?? '') &&
      checker
        .getTypeArguments(type)
        .some((argument) => containsAny(argument, seen))
    );
  }

  for (const fileName of project.rootFiles) {
    const candidate = program.getSourceFile(fileName);
    if (!candidate) {
      throw new Error(`Source file could not be loaded: ${fileName}`);
    }
    /** @type {import('typescript/unstable/ast').SourceFile} */
    const source = candidate;

    /** @param {import('typescript/unstable/ast').Node} node */
    function visit(node) {
      /** @type {string | undefined} */
      let message;
      if (node.kind === SyntaxKind.AnyKeyword) {
        message = 'Explicit any is not allowed';
      }
      if (
        (isVariableDeclaration(node) ||
          isParameterDeclaration(node) ||
          isBindingElement(node)) &&
        node.name &&
        isIdentifier(node.name) &&
        containsAny(checker.getTypeAtLocation(node.name))
      ) {
        message = 'Declaration contains inferred any';
      }
      if (
        (isCallExpression(node) || isNewExpression(node)) &&
        (checker.getTypeAtLocation(node.expression)?.flags ?? 0) & TypeFlags.Any
      ) {
        message = 'Unsafe invocation of any';
      }
      if (
        (isPropertyAccessExpression(node) || isElementAccessExpression(node)) &&
        (checker.getTypeAtLocation(node.expression)?.flags ?? 0) & TypeFlags.Any
      ) {
        message = 'Unsafe member access on any';
      }
      if (
        isReturnStatement(node) &&
        node.expression &&
        containsAny(checker.getTypeAtLocation(node.expression))
      ) {
        message = 'Unsafe return of any';
      }
      if (message) {
        const location = source.getLineAndCharacterOfPosition(
          Math.max(0, node.pos)
        );
        // oxlint-disable-next-line eslint/no-console -- Report type-policy diagnostics.
        console.error(
          `${relative(process.cwd(), fileName)}:${location.line + 1}:${
            location.character + 1
          }: ${message}`
        );
        failures++;
      }
      node.forEachChild(visit);
    }
    visit(source);
  }
  if (failures) {
    process.exitCode = 1;
  } else {
    // oxlint-disable-next-line eslint/no-console -- Confirm successful policy validation.
    console.log('No explicit, inferred, or unsafely used any types found');
  }
} finally {
  snapshot.dispose();
  api.close();
}
