import { Static, Type } from '@sinclair/typebox'
import { PackageType, PieceType, VersionType } from '../../pieces'
import { SampleDataSettingsObject } from '../sample-data'
import { PieceTriggerSettings } from '../triggers/trigger'

export enum ActionType {
    CODE = 'CODE',
    PIECE = 'PIECE',
    LOOP_ON_ITEMS = 'LOOP_ON_ITEMS',
    BRANCH = 'BRANCH',
    ROUTER = 'ROUTER',
}

export enum RouterExecutionType {
    EXECUTE_ALL_MATCH = 'EXECUTE_ALL_MATCH',
    EXECUTE_FIRST_MATCH = 'EXECUTE_FIRST_MATCH',
}

export enum BranchExecutionType {
    FALLBACK = 'FALLBACK',
    CONDITION = 'CONDITION',
}

const commonActionProps = {
    name: Type.String({}),
    valid: Type.Boolean({}),
    displayName: Type.String({}),
}

export const ActionErrorHandlingOptions = Type.Optional(Type.Object({
    continueOnFailure: Type.Optional(Type.Object({
        value: Type.Boolean(),
    })),
    retryOnFailure: Type.Optional(Type.Object({
        value: Type.Boolean(),
    })),
}))
export type ActionErrorHandlingOptions = Static<typeof ActionErrorHandlingOptions>

export const SourceCode = Type.Object({
    packageJson: Type.String({}),
    code: Type.String({}),
})

export type SourceCode = Static<typeof SourceCode>

export const CodeActionSettings = Type.Object({
    sourceCode: SourceCode,
    input: Type.Record(Type.String({}), Type.Any()),
    inputUiInfo: Type.Optional(SampleDataSettingsObject),
    errorHandlingOptions: ActionErrorHandlingOptions,
})

export type CodeActionSettings = Static<typeof CodeActionSettings>

export const CodeActionSchema = Type.Object({
    ...commonActionProps,
    type: Type.Literal(ActionType.CODE),
    settings: CodeActionSettings,
})
export const PieceActionSettings = Type.Object({    
    packageType: Type.Enum(PackageType),
    pieceType: Type.Enum(PieceType),
    pieceName: Type.String({}),
    pieceVersion: VersionType,
    actionName: Type.Optional(Type.String({})),
    input: Type.Record(Type.String({}), Type.Unknown()),
    inputUiInfo: SampleDataSettingsObject,
    errorHandlingOptions: ActionErrorHandlingOptions,
})
export type PieceActionSettings = Static<typeof PieceActionSettings>

export const PieceActionSchema = Type.Object({
    ...commonActionProps,
    type: Type.Literal(ActionType.PIECE),
    settings: PieceActionSettings,
})

// Loop Items
export const LoopOnItemsActionSettings = Type.Object({
    items: Type.String(),
    inputUiInfo: SampleDataSettingsObject,
})
export type LoopOnItemsActionSettings = Static<typeof LoopOnItemsActionSettings>

export const LoopOnItemsActionSchema = Type.Object({
    ...commonActionProps,
    type: Type.Literal(ActionType.LOOP_ON_ITEMS),
    settings: LoopOnItemsActionSettings,
})

export enum BranchOperator {
    TEXT_CONTAINS = 'TEXT_CONTAINS',
    TEXT_DOES_NOT_CONTAIN = 'TEXT_DOES_NOT_CONTAIN',
    TEXT_EXACTLY_MATCHES = 'TEXT_EXACTLY_MATCHES',
    TEXT_DOES_NOT_EXACTLY_MATCH = 'TEXT_DOES_NOT_EXACTLY_MATCH',
    TEXT_STARTS_WITH = 'TEXT_START_WITH',
    TEXT_DOES_NOT_START_WITH = 'TEXT_DOES_NOT_START_WITH',
    TEXT_ENDS_WITH = 'TEXT_ENDS_WITH',
    TEXT_DOES_NOT_END_WITH = 'TEXT_DOES_NOT_END_WITH',
    NUMBER_IS_GREATER_THAN = 'NUMBER_IS_GREATER_THAN',
    NUMBER_IS_LESS_THAN = 'NUMBER_IS_LESS_THAN',
    NUMBER_IS_EQUAL_TO = 'NUMBER_IS_EQUAL_TO',
    BOOLEAN_IS_TRUE = 'BOOLEAN_IS_TRUE',
    BOOLEAN_IS_FALSE = 'BOOLEAN_IS_FALSE',
    EXISTS = 'EXISTS',
    DOES_NOT_EXIST = 'DOES_NOT_EXIST',
}

export const singleValueConditions = [
    BranchOperator.EXISTS,
    BranchOperator.DOES_NOT_EXIST,
    BranchOperator.BOOLEAN_IS_TRUE,
    BranchOperator.BOOLEAN_IS_FALSE,
]

export const textConditions = [
    BranchOperator.TEXT_CONTAINS,
    BranchOperator.TEXT_DOES_NOT_CONTAIN,
    BranchOperator.TEXT_EXACTLY_MATCHES,
    BranchOperator.TEXT_DOES_NOT_EXACTLY_MATCH,
    BranchOperator.TEXT_STARTS_WITH,
    BranchOperator.TEXT_DOES_NOT_START_WITH,
    BranchOperator.TEXT_ENDS_WITH,
    BranchOperator.TEXT_DOES_NOT_END_WITH,
]

const BranchOperatorTextLiterals = [
    Type.Literal(BranchOperator.TEXT_CONTAINS),
    Type.Literal(BranchOperator.TEXT_DOES_NOT_CONTAIN),
    Type.Literal(BranchOperator.TEXT_EXACTLY_MATCHES),
    Type.Literal(BranchOperator.TEXT_DOES_NOT_EXACTLY_MATCH),
    Type.Literal(BranchOperator.TEXT_STARTS_WITH),
    Type.Literal(BranchOperator.TEXT_DOES_NOT_START_WITH),
    Type.Literal(BranchOperator.TEXT_ENDS_WITH),
    Type.Literal(BranchOperator.TEXT_DOES_NOT_END_WITH),
]

const BranchOperatorNumberLiterals = [
    Type.Literal(BranchOperator.NUMBER_IS_GREATER_THAN),
    Type.Literal(BranchOperator.NUMBER_IS_LESS_THAN),
    Type.Literal(BranchOperator.NUMBER_IS_EQUAL_TO),
]

const BranchOperatorSingleValueLiterals = [
    Type.Literal(BranchOperator.EXISTS),
    Type.Literal(BranchOperator.DOES_NOT_EXIST),
    Type.Literal(BranchOperator.BOOLEAN_IS_TRUE),
    Type.Literal(BranchOperator.BOOLEAN_IS_FALSE),
]

const BranchTextConditionValid = (addMinLength: boolean) => Type.Object({
    firstValue: Type.String(addMinLength ? { minLength: 1 } : {}),
    secondValue: Type.String(addMinLength ? { minLength: 1 } : {}),
    caseSensitive: Type.Optional(Type.Boolean()),
    operator: Type.Optional(Type.Union(BranchOperatorTextLiterals)),
})

const BranchNumberConditionValid = (addMinLength: boolean) => Type.Object({
    firstValue: Type.String(addMinLength ? { minLength: 1 } : {}),
    secondValue: Type.String(addMinLength ? { minLength: 1 } : {}),
    operator: Type.Optional(Type.Union(BranchOperatorNumberLiterals)),
})

const BranchSingleValueConditionValid = (addMinLength: boolean) => Type.Object({
    firstValue: Type.String(addMinLength ? { minLength: 1 } : {}),
    operator: Type.Optional(Type.Union(BranchOperatorSingleValueLiterals)),
})

const BranchConditionValid = (addMinLength: boolean) => Type.Union([
    BranchTextConditionValid(addMinLength),
    BranchNumberConditionValid(addMinLength),
    BranchSingleValueConditionValid(addMinLength),
])

export const BranchActionSettingsWithValidation = Type.Object({
    conditions: Type.Array(Type.Array(BranchConditionValid(true))),
    inputUiInfo: SampleDataSettingsObject,
})

export const ValidBranchCondition = BranchConditionValid(true)
export type ValidBranchCondition = Static<typeof ValidBranchCondition>

// TODO remove this and use ValidBranchCondition everywhere
export const BranchCondition = BranchConditionValid(false)
export type BranchCondition = Static<typeof BranchCondition>

export const BranchTextCondition = BranchTextConditionValid(false)
export type BranchTextCondition = Static<typeof BranchTextCondition>

export const BranchNumberCondition = BranchNumberConditionValid(false)
export type BranchNumberCondition = Static<typeof BranchNumberCondition>

export const BranchSingleValueCondition = BranchSingleValueConditionValid(false)
export type BranchSingleValueCondition = Static<typeof BranchSingleValueCondition>

export const BranchActionSettings = Type.Object({
    conditions: Type.Array(Type.Array(BranchConditionValid(false))),
    inputUiInfo: SampleDataSettingsObject,
})
export type BranchActionSettings = Static<typeof BranchActionSettings>

export const RouterActionSettings = Type.Object({
    branches: Type.Array(
        Type.Union([
            Type.Object({
                conditions: Type.Array(Type.Array(BranchConditionValid(false))),
                branchType: Type.Literal(BranchExecutionType.CONDITION),
            }),
            Type.Object({
                branchType: Type.Literal(BranchExecutionType.FALLBACK),
            }),
        ], 
        ),
    ),
    executionType: Type.Enum(RouterExecutionType),
    inputUiInfo: SampleDataSettingsObject,
})
export type RouterActionSettings = Static<typeof RouterActionSettings>

export const BranchActionSchema = Type.Object({
    ...commonActionProps,
    type: Type.Literal(ActionType.BRANCH),
    settings: BranchActionSettings,
})

export const RouterActionSchema = Type.Object({
    ...commonActionProps,
    type: Type.Literal(ActionType.ROUTER),
    settings: RouterActionSettings,
})

// Union of all actions

export const Action = Type.Recursive(action => Type.Union([
    Type.Intersect([CodeActionSchema, Type.Object({
        nextAction: Type.Optional(action),
    })]),
    Type.Intersect([PieceActionSchema, Type.Object({
        nextAction: Type.Optional(action),
    })]),
    Type.Intersect([LoopOnItemsActionSchema, Type.Object({
        nextAction: Type.Optional(action),
        firstLoopAction: Type.Optional(action),
    })]),
    Type.Intersect([BranchActionSchema, Type.Object({
        nextAction: Type.Optional(action),
        onSuccessAction: Type.Optional(action),
        onFailureAction: Type.Optional(action),
    })]),
    Type.Intersect([RouterActionSchema, Type.Object({
        nextAction: Type.Optional(action),
        children: Type.Optional(Type.Array(action)),
    })]),
]))

export const SingleActionSchema = Type.Union([
    CodeActionSchema,
    PieceActionSchema,
    LoopOnItemsActionSchema,
    BranchActionSchema,
])
export type Action = Static<typeof Action>


export type BranchAction = Static<typeof BranchActionSchema> & { nextAction?: Action, onFailureAction?: Action, onSuccessAction?: Action }

export type RouterAction = Static<typeof RouterActionSchema> & { nextAction?: Action, children: Action[] }

export type LoopOnItemsAction = Static<typeof LoopOnItemsActionSchema> & { nextAction?: Action, firstLoopAction?: Action }


export type PieceAction = Static<typeof PieceActionSchema> & { nextAction?: Action }

export type CodeAction = Static<typeof CodeActionSchema> & { nextAction?: Action }


export type StepSettings =
    | CodeActionSettings
    | PieceActionSettings
    | PieceTriggerSettings
    | BranchActionSettings
    | LoopOnItemsActionSettings