import { layer_ref, length, distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type CommonLayoutProps,
  commonLayoutProps,
  type SupplierPartNumbers,
} from "lib/common/layout"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { AnySourceComponent, PcbTrace } from "circuit-json"
import {
  manual_edits_file,
  type ManualEditsFile,
  type ManualEditsFileInput,
} from "lib/manual-edits"

export const layoutConfig = z.object({
  layoutMode: z
    .enum(["grid", "flex", "match-adapt", "relative", "none"])
    .optional(),
  position: z.enum(["absolute", "relative"]).optional(),

  grid: z.boolean().optional(),
  gridCols: z.number().or(z.string()).optional(),
  gridRows: z.number().or(z.string()).optional(),
  gridTemplateRows: z.string().optional(),
  gridTemplateColumns: z.string().optional(),
  gridTemplate: z.string().optional(),
  gridGap: z.number().or(z.string()).optional(),
  gridRowGap: z.number().or(z.string()).optional(),
  gridColumnGap: z.number().or(z.string()).optional(),

  flex: z.boolean().or(z.string()).optional(),
  flexDirection: z.enum(["row", "column"]).optional(),
  alignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  justifyContent: z
    .enum([
      "start",
      "center",
      "end",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .optional(),
  flexRow: z.boolean().optional(),
  flexColumn: z.boolean().optional(),
  gap: z.number().or(z.string()).optional(),

  pack: z
    .boolean()
    .optional()
    .describe("Pack the contents of this group using a packing strategy"),
  packOrderStrategy: z
    .enum([
      "largest_to_smallest",
      "first_to_last",
      "highest_to_lowest_pin_count",
    ])
    .optional(),
  packPlacementStrategy: z
    .enum(["shortest_connection_along_outline"])
    .optional(),

  padding: length.optional(),
  paddingLeft: length.optional(),
  paddingRight: length.optional(),
  paddingTop: length.optional(),
  paddingBottom: length.optional(),
  paddingX: length.optional(),
  paddingY: length.optional(),

  width: length.optional(),
  height: length.optional(),

  matchAdapt: z.boolean().optional(),
  matchAdaptTemplate: z.any().optional(),
})

export interface LayoutConfig {
  layoutMode?: "grid" | "flex" | "match-adapt" | "relative" | "none"
  position?: "absolute" | "relative"

  grid?: boolean
  gridCols?: number | string
  gridRows?: number | string
  gridTemplateRows?: string
  gridTemplateColumns?: string
  gridTemplate?: string
  gridGap?: number | string
  gridRowGap?: number | string
  gridColumnGap?: number | string

  flex?: boolean | string
  flexDirection?: "row" | "column"
  alignItems?: "start" | "center" | "end" | "stretch"
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
  flexRow?: boolean
  flexColumn?: boolean
  gap?: number | string

  pack?: boolean
  packOrderStrategy?:
    | "largest_to_smallest"
    | "first_to_last"
    | "highest_to_lowest_pin_count"
  packPlacementStrategy?: "shortest_connection_along_outline"

  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
  paddingX?: Distance
  paddingY?: Distance

  width?: Distance
  height?: Distance

  matchAdapt?: boolean
  matchAdaptTemplate?: any
}

expectTypesMatch<LayoutConfig, z.input<typeof layoutConfig>>(true)

export interface Border {
  strokeWidth?: Distance
  dashed?: boolean
  solid?: boolean
}

export const border = z.object({
  strokeWidth: length.optional(),
  dashed: z.boolean().optional(),
  solid: z.boolean().optional(),
})

export interface BaseGroupProps extends CommonLayoutProps, LayoutConfig {
  name?: string
  key?: any
  children?: any

  /**
   * Title to display above this group in the schematic view
   */
  schTitle?: string

  pcbWidth?: Distance
  pcbHeight?: Distance
  schWidth?: Distance
  schHeight?: Distance

  pcbLayout?: LayoutConfig
  schLayout?: LayoutConfig
  cellBorder?: Border | null
  border?: Border | null
  schPadding?: Distance
  schPaddingLeft?: Distance
  schPaddingRight?: Distance
  schPaddingTop?: Distance
  schPaddingBottom?: Distance

  pcbPadding?: Distance
  pcbPaddingLeft?: Distance
  pcbPaddingRight?: Distance
  pcbPaddingTop?: Distance
  pcbPaddingBottom?: Distance

  /** @deprecated Use `pcbGrid` */
  grid?: boolean
  /** @deprecated Use `pcbFlex` */
  flex?: boolean | string

  pcbGrid?: boolean
  pcbGridCols?: number | string
  pcbGridRows?: number | string
  pcbGridTemplateRows?: string
  pcbGridTemplateColumns?: string
  pcbGridTemplate?: string
  pcbGridGap?: number | string
  pcbGridRowGap?: number | string
  pcbGridColumnGap?: number | string

  pcbFlex?: boolean | string
  pcbFlexGap?: number | string
  pcbFlexDirection?: "row" | "column"
  pcbAlignItems?: "start" | "center" | "end" | "stretch"
  pcbJustifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
  pcbFlexRow?: boolean
  pcbFlexColumn?: boolean
  pcbGap?: number | string
  pcbPack?: boolean

  schGrid?: boolean
  schGridCols?: number | string
  schGridRows?: number | string
  schGridTemplateRows?: string
  schGridTemplateColumns?: string
  schGridTemplate?: string
  schGridGap?: number | string
  schGridRowGap?: number | string
  schGridColumnGap?: number | string

  schFlex?: boolean | string
  schFlexGap?: number | string
  schFlexDirection?: "row" | "column"
  schAlignItems?: "start" | "center" | "end" | "stretch"
  schJustifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
  schFlexRow?: boolean
  schFlexColumn?: boolean
  schGap?: number | string
  schPack?: boolean
  schMatchAdapt?: boolean
}

export type PartsEngine = {
  findPart: (params: {
    sourceComponent: AnySourceComponent
    footprinterString?: string
  }) => Promise<SupplierPartNumbers> | SupplierPartNumbers
}

export interface PcbRouteCache {
  pcbTraces: PcbTrace[]
  cacheKey: string
}

export interface AutorouterConfig {
  serverUrl?: string
  inputFormat?: "simplified" | "circuit-json"
  serverMode?: "job" | "solve-endpoint"
  serverCacheEnabled?: boolean
  cache?: PcbRouteCache
  traceClearance?: Distance
  groupMode?: "sequential-trace" | "subcircuit"
  local?: boolean
  algorithmFn?: (simpleRouteJson: any) => Promise<any>
  preset?:
    | "sequential-trace"
    | "subcircuit"
    | "auto"
    | "auto-local"
    | "auto-cloud"
}

export type AutorouterProp =
  | AutorouterConfig
  | "sequential-trace"
  | "subcircuit"
  | "auto"
  | "auto-local"
  | "auto-cloud"

export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  serverMode: z.enum(["job", "solve-endpoint"]).optional(),
  serverCacheEnabled: z.boolean().optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
  traceClearance: length.optional(),
  groupMode: z.enum(["sequential-trace", "subcircuit"]).optional(),
  algorithmFn: z
    .custom<(simpleRouteJson: any) => Promise<any>>(
      (v) => typeof v === "function" || v === undefined,
    )
    .optional(),
  preset: z
    .enum([
      "sequential-trace",
      "subcircuit",
      "auto",
      "auto-local",
      "auto-cloud",
    ])
    .optional(),
  local: z.boolean().optional(),
})

export const autorouterProp = z.union([
  autorouterConfig,
  z.literal("sequential-trace"),
  z.literal("subcircuit"),
  z.literal("auto"),
  z.literal("auto-local"),
  z.literal("auto-cloud"),
])

export interface SubcircuitGroupProps extends BaseGroupProps {
  manualEdits?: ManualEditsFileInput
  routingDisabled?: boolean
  defaultTraceWidth?: Distance
  minTraceWidth?: Distance
  pcbRouteCache?: PcbRouteCache

  autorouter?: AutorouterProp

  /**
   * If true, we'll automatically layout the schematic for this group. Must be
   * a subcircuit (currently). This is eventually going to be replaced with more
   * sophisticated layout options/modes and will be enabled by default.
   */
  schAutoLayoutEnabled?: boolean

  /**
   * If true, net labels will automatically be created for complex traces
   */
  schTraceAutoLabelEnabled?: boolean

  partsEngine?: PartsEngine

  /** When autosizing, the board will be made square */
  square?: boolean
  /** Desired empty area of the board e.g. "22mm^2" or "20%" */
  emptyArea?: string
  /** Desired filled area of the board e.g. "22mm^2" or "20%" */
  filledArea?: string

  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
}

export interface SubcircuitGroupPropsWithBool extends SubcircuitGroupProps {
  subcircuit: true
}

export interface NonSubcircuitGroupProps extends BaseGroupProps {
  subcircuit?: false | undefined
}

export type GroupProps = SubcircuitGroupPropsWithBool | NonSubcircuitGroupProps

export const baseGroupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  children: z.any().optional(),
  schTitle: z.string().optional(),
  key: z.any().optional(),

  ...layoutConfig.shape,
  grid: layoutConfig.shape.grid.describe("@deprecated use pcbGrid"),
  flex: layoutConfig.shape.flex.describe("@deprecated use pcbFlex"),
  pcbGrid: z.boolean().optional(),
  pcbGridCols: z.number().or(z.string()).optional(),
  pcbGridRows: z.number().or(z.string()).optional(),
  pcbGridTemplateRows: z.string().optional(),
  pcbGridTemplateColumns: z.string().optional(),
  pcbGridTemplate: z.string().optional(),
  pcbGridGap: z.number().or(z.string()).optional(),
  pcbGridRowGap: z.number().or(z.string()).optional(),
  pcbGridColumnGap: z.number().or(z.string()).optional(),
  pcbFlex: z.boolean().or(z.string()).optional(),
  pcbFlexGap: z.number().or(z.string()).optional(),
  pcbFlexDirection: z.enum(["row", "column"]).optional(),
  pcbAlignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  pcbJustifyContent: z
    .enum([
      "start",
      "center",
      "end",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .optional(),
  pcbFlexRow: z.boolean().optional(),
  pcbFlexColumn: z.boolean().optional(),
  pcbGap: z.number().or(z.string()).optional(),
  pcbPack: z.boolean().optional(),

  schGrid: z.boolean().optional(),
  schGridCols: z.number().or(z.string()).optional(),
  schGridRows: z.number().or(z.string()).optional(),
  schGridTemplateRows: z.string().optional(),
  schGridTemplateColumns: z.string().optional(),
  schGridTemplate: z.string().optional(),
  schGridGap: z.number().or(z.string()).optional(),
  schGridRowGap: z.number().or(z.string()).optional(),
  schGridColumnGap: z.number().or(z.string()).optional(),

  schFlex: z.boolean().or(z.string()).optional(),
  schFlexGap: z.number().or(z.string()).optional(),
  schFlexDirection: z.enum(["row", "column"]).optional(),
  schAlignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  schJustifyContent: z
    .enum([
      "start",
      "center",
      "end",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .optional(),
  schFlexRow: z.boolean().optional(),
  schFlexColumn: z.boolean().optional(),
  schGap: z.number().or(z.string()).optional(),
  schPack: z.boolean().optional(),
  schMatchAdapt: z.boolean().optional(),
  pcbWidth: length.optional(),
  pcbHeight: length.optional(),
  schWidth: length.optional(),
  schHeight: length.optional(),
  pcbLayout: layoutConfig.optional(),
  schLayout: layoutConfig.optional(),
  cellBorder: border.nullable().optional(),
  border: border.nullable().optional(),
  schPadding: length.optional(),
  schPaddingLeft: length.optional(),
  schPaddingRight: length.optional(),
  schPaddingTop: length.optional(),
  schPaddingBottom: length.optional(),
  pcbPadding: length.optional(),
  pcbPaddingLeft: length.optional(),
  pcbPaddingRight: length.optional(),
  pcbPaddingTop: length.optional(),
  pcbPaddingBottom: length.optional(),
})

export const partsEngine = z.custom<PartsEngine>((v) => "findPart" in v)

export const subcircuitGroupProps = baseGroupProps.extend({
  manualEdits: manual_edits_file.optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
  schTraceAutoLabelEnabled: z.boolean().optional(),
  routingDisabled: z.boolean().optional(),
  defaultTraceWidth: length.optional(),
  minTraceWidth: length.optional(),
  partsEngine: partsEngine.optional(),
  pcbRouteCache: z.custom<PcbRouteCache>((v) => true).optional(),
  autorouter: autorouterProp.optional(),
  square: z.boolean().optional(),
  emptyArea: z.string().optional(),
  filledArea: z.string().optional(),
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  outlineOffsetX: distance.optional(),
  outlineOffsetY: distance.optional(),
})

export const subcircuitGroupPropsWithBool = subcircuitGroupProps.extend({
  subcircuit: z.literal(true),
})

export const groupProps = z.discriminatedUnion("subcircuit", [
  baseGroupProps.extend({ subcircuit: z.literal(false).optional() }),
  subcircuitGroupPropsWithBool,
])

type InferredBaseGroupProps = z.input<typeof baseGroupProps>
type InferredSubcircuitGroupPropsWithBool = z.input<
  typeof subcircuitGroupPropsWithBool
>

expectTypesMatch<BaseGroupProps, InferredBaseGroupProps>(true)
expectTypesMatch<
  SubcircuitGroupPropsWithBool,
  InferredSubcircuitGroupPropsWithBool
>(true)

type InferredGroupProps = z.input<typeof groupProps>
expectTypesMatch<GroupProps, InferredGroupProps>(true)
