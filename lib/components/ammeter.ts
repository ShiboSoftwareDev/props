import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const ammeterPinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type AmmeterPinLabels = (typeof ammeterPinLabels)[number]

export interface AmmeterDisplayOptions {
  label?: string
  center?: number
  offsetDivs?: number
  unitsPerDiv?: number
}

export interface AmmeterProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections: Connections<AmmeterPinLabels>
  color?: string
  display?: AmmeterDisplayOptions
}

const hasAmmeterConnectionPair = (
  connections: Connections<AmmeterPinLabels>,
) => {
  return (
    (connections.pos !== undefined && connections.neg !== undefined) ||
    (connections.pin1 !== undefined && connections.pin2 !== undefined)
  )
}

export const ammeterDisplayOptions = z.object({
  label: z.string().optional(),
  center: z.number().optional(),
  offsetDivs: z.number().optional(),
  unitsPerDiv: z.number().optional(),
})

export const ammeterProps = commonComponentProps.extend({
  connections: createConnectionsProp(ammeterPinLabels).refine(
    hasAmmeterConnectionPair,
    "Ammeter connections must include either pos/neg or pin1/pin2",
  ),
  color: z.string().optional(),
  display: ammeterDisplayOptions.optional(),
})

export const ammeterPins = ammeterPinLabels

type InferredAmmeterProps = z.input<typeof ammeterProps>
expectTypesMatch<AmmeterProps, InferredAmmeterProps>(true)
