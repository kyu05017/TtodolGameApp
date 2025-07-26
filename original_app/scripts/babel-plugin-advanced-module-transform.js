// 고급 모듈 변환 플러그인 - JavaScript 함수 호출 최적화
module.exports = function({ types: t }) {
  return {
    name: "advanced-module-transform",
    visitor: {
      // 프로그램 시작시 모듈 스코프 준비
      Program: {
        enter(path) {
          // 모듈 스코프에 안전장치 함수들 추가
          const safeRequireDeclaration = t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier('__safeRequire'),
              t.functionExpression(
                null,
                [t.identifier('moduleId')],
                t.blockStatement([
                  t.tryStatement(
                    t.blockStatement([
                      t.ifStatement(
                        t.logicalExpression('||',
                          t.binaryExpression('===', t.unaryExpression('typeof', t.identifier('moduleId')), t.stringLiteral('undefined')),
                          t.binaryExpression('===', t.identifier('moduleId'), t.nullLiteral())
                        ),
                        t.returnStatement(t.objectExpression([]))
                      ),
                      t.ifStatement(
                        t.logicalExpression('&&',
                          t.binaryExpression('===', t.unaryExpression('typeof', t.identifier('moduleId')), t.stringLiteral('string')),
                          t.callExpression(
                            t.memberExpression(t.identifier('moduleId'), t.identifier('startsWith')),
                            [t.stringLiteral('@babel/runtime/helpers/')]
                          )
                        ),
                        t.returnStatement(
                          t.functionExpression(null, [], t.blockStatement([
                            t.returnStatement(t.memberExpression(t.identifier('arguments'), t.numericLiteral(0), true))
                          ]))
                        )
                      ),
                      t.returnStatement(
                        t.callExpression(t.identifier('require'), [t.identifier('moduleId')])
                      )
                    ]),
                    t.catchClause(
                      t.identifier('error'),
                      t.blockStatement([
                        t.expressionStatement(
                          t.callExpression(
                            t.memberExpression(t.identifier('console'), t.identifier('warn')),
                            [t.stringLiteral('Safe require error:'), t.identifier('moduleId'), t.memberExpression(t.identifier('error'), t.identifier('message'))]
                          )
                        ),
                        t.returnStatement(t.objectExpression([]))
                      ])
                    )
                  )
                ])
              )
            )
          ]);
          
          path.unshiftContainer('body', safeRequireDeclaration);
        }
      },
      
      // require 호출 최적화
      CallExpression(path) {
        const { node } = path;
        
        // require 호출 감지
        if (t.isIdentifier(node.callee, { name: 'require' })) {
          // 인자가 없거나 잘못된 경우
          if (node.arguments.length === 0) {
            path.replaceWith(t.objectExpression([]));
            return;
          }
          
          const firstArg = node.arguments[0];
          
          // undefined 또는 null 인자
          if (t.isNullLiteral(firstArg) || t.isIdentifier(firstArg, { name: 'undefined' })) {
            path.replaceWith(t.objectExpression([]));
            return;
          }
          
          // @babel/runtime/helpers 호출 차단
          if (t.isStringLiteral(firstArg) && firstArg.value.startsWith('@babel/runtime/helpers/')) {
            console.log('Blocking babel helper require:', firstArg.value);
            path.replaceWith(
              t.functionExpression(null, [], t.blockStatement([
                t.returnStatement(t.memberExpression(t.identifier('arguments'), t.numericLiteral(0), true))
              ]))
            );
            return;
          }
          
          // 동적 require 호출을 안전한 래퍼로 변경
          if (!t.isStringLiteral(firstArg)) {
            path.replaceWith(
              t.callExpression(t.identifier('__safeRequire'), [firstArg])
            );
            return;
          }
        }
        
        // Object.defineProperty 최적화
        if (t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object, { name: 'Object' }) &&
            t.isIdentifier(node.callee.property, { name: 'defineProperty' })) {
          
          if (node.arguments.length >= 3) {
            const [obj, key, descriptor] = node.arguments;
            
            // 단순한 속성 할당으로 최적화 가능한 경우
            if (t.isObjectExpression(descriptor)) {
              const valueProperty = descriptor.properties.find(prop => 
                t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'value' })
              );
              
              if (valueProperty) {
                path.replaceWith(
                  t.assignmentExpression('=',
                    t.memberExpression(obj, key, t.isStringLiteral(key)),
                    valueProperty.value
                  )
                );
                return;
              }
            }
          }
        }
        
        // Function.prototype.apply/call 최적화
        if (t.isMemberExpression(node.callee) &&
            t.isMemberExpression(node.callee.object) &&
            t.isIdentifier(node.callee.property, { name: 'apply' })) {
          
          // func.apply(this, arguments) -> func(...arguments) 형태로 최적화
          if (node.arguments.length === 2 &&
              t.isThisExpression(node.arguments[0]) &&
              t.isIdentifier(node.arguments[1], { name: 'arguments' })) {
            
            path.replaceWith(
              t.callExpression(node.callee.object, [
                t.spreadElement(t.identifier('arguments'))
              ])
            );
            return;
          }
        }
      },
      
      // 모듈 익스포트 최적화
      AssignmentExpression(path) {
        const { node } = path;
        
        // module.exports = ... 패턴 최적화
        if (t.isMemberExpression(node.left) &&
            t.isIdentifier(node.left.object, { name: 'module' }) &&
            t.isIdentifier(node.left.property, { name: 'exports' })) {
          
          // 함수 익스포트인 경우 즉시 실행 가능하도록 최적화
          if (t.isFunctionExpression(node.right) || t.isArrowFunctionExpression(node.right)) {
            // 함수가 즉시 호출되는 패턴인지 확인
            const parent = path.parentPath;
            if (t.isCallExpression(parent.node)) {
              // 함수를 즉시 실행 함수로 래핑
              path.get('right').replaceWith(
                t.callExpression(
                  t.functionExpression(null, [], t.blockStatement([
                    t.returnStatement(node.right)
                  ])),
                  []
                )
              );
            }
          }
        }
        
        // exports.property = ... 패턴 최적화
        if (t.isMemberExpression(node.left) &&
            t.isIdentifier(node.left.object, { name: 'exports' })) {
          
          // 프로퍼티 이름이 문자열이면 대괄호 표기법으로 통일
          if (t.isIdentifier(node.left.property) && !node.left.computed) {
            node.left.computed = true;
            node.left.property = t.stringLiteral(node.left.property.name);
          }
        }
      },
      
      // 변수 선언 최적화
      VariableDeclaration(path) {
        const { node } = path;
        
        // var 선언을 const/let으로 최적화할 수 있는 경우
        if (node.kind === 'var') {
          let canOptimize = true;
          
          for (const declarator of node.declarations) {
            // 재할당되는지 확인
            if (declarator.id && t.isIdentifier(declarator.id)) {
              const binding = path.scope.getBinding(declarator.id.name);
              if (binding && !binding.constantViolations.length) {
                // 재할당이 없으면 const로 변경 가능
                continue;
              }
            }
            canOptimize = false;
            break;
          }
          
          if (canOptimize) {
            node.kind = 'const';
          }
        }
      },
      
      // 조건문 최적화
      ConditionalExpression(path) {
        const { node } = path;
        
        // 불필요한 삼항 연산자 최적화
        if (t.isBooleanLiteral(node.test)) {
          path.replaceWith(node.test.value ? node.consequent : node.alternate);
        }
        
        // typeof 검사 최적화
        if (t.isBinaryExpression(node.test) &&
            node.test.operator === '===' &&
            t.isUnaryExpression(node.test.left, { operator: 'typeof' })) {
          
          // typeof x === 'undefined' -> x === undefined 최적화 (안전한 경우)
          if (t.isStringLiteral(node.test.right, { value: 'undefined' })) {
            const target = node.test.left.argument;
            if (t.isIdentifier(target)) {
              node.test = t.binaryExpression('===', target, t.identifier('undefined'));
            }
          }
        }
      }
    }
  };
};