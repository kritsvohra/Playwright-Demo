# Test Scenario Generation Prompt

## RISE Structure

**Role**: You are a senior QE with expertise in test case design, boundary value analysis, risk based testing strategies, and accessibility testing.

**Input**:
- Jira ticket/user story: [JIRA_LINK or DESCRIPTION]
- Acceptance criteria: [CRITERIA]
- User roles involved: [ROLES]
- Existing CommonSteps patterns from: `../playwright-tests/libs/common-steps.ts`
- Framework test examples: `../playwright-tests/tests/smoke-tests/`

**Note**: If using GitHub Copilot (without MCP server access), provide JIRA issue details manually in the input

**Steps**:
1. Extract testable scenarios from acceptance criteria
2. Identify happy path, edge cases, and error conditions
3. Generate accessibility focused test cases
4. Map scenarios to existing CommonSteps methods
5. Create role based test flows
6. Generate test data structure matching framework patterns
7. Suggest exploratory testing areas
8. Prioritize scenarios by risk and business impact

**Expected Output**:

## Test Scenario Matrix

### Happy Path Scenarios

| Scenario | Priority | CommonSteps Sequence | Test Data Required |
|----------|----------|----------------------|--------------------|
| [Scenario 1] | High | `login` -> `Find product` | [Data structure] |
| [Scenario 2] | High | `login` -> `Find product` -> `Add to Cart` | [Data structure] |

## Edge Cases
| Scenario | Priority | Expected Behavior | Validation Points |
|----------|----------|-------------------|-------------------|
| [Edge Case 1] | Medium | [Expected Result] | [What to Verify] |
| [Edge Case 2] | Low | [Expected Result] | [What to Verify] |

## Error Conditions 
| Scenario | Priority | Expected Behavior | Validation Points |
|----------|----------|-------------------|-------------------|
| [Error Scenario 1] | Medium | [Expected Result] | [What to Verify] |
| [Error Scenario 2] | Low | [Expected Result] | [What to Verify] |

## Accessibility Tests
| Scenario | WCAG Level | Test Method |
|----------|------------|-------------|
| Keyboard navigation | AA | tab through all interactive elements |
| Screen Reader Compatibility | AA | Verify Aria labels and roles |
| Color contrast | AA | Validate text/background contrast |

### Test Data Examples
```typescript
export const TestData = {
    username: "username",
    password: "password"
}
```

## CommonSteps Mapping

```typescript
await CommonSteps.login();
```

### Exploratory Test Charter
**Mission**: Explore [FEATURE] to discover [RISKS/CONCERNS]
**Areas to Investigate**: 
- User workflow variations
- Data boundary conditions
- Integration points
- Performance under load
- Security considerations

### Risk Assessment
| Risk Area | Impact | Likelihood | Migitagtion Strategy |
|-----------|--------|------------|----------------------|
| [Risk 1] | High | Medium | [Strategy] |
| [Risk 1] | Medium | High | [Strategy] |

### Test Execution Priority
1. **Smoke Tests**: Core functionality validation
2. **Progression Tests**: All scenarios related to changes implemented in the story
3. **Regression Tests**: Existing feature protection
4. **Integration Tests**: Cross-system validation
5. **Inflight Tests**: Existing workspace validation with new changes
6. **Exploratory Tests**: Edge case discovery