import {
  type DatatypeA,
  datatypeA,
} from "~/xjustiz-schemata/din-91379/datatypeA";
import {
  type DatatypeB,
  datatypeB,
} from "~/xjustiz-schemata/din-91379/datatypeB";

/**
 * Message orchestrator to compose a Nachricht for a _Zahlungsklage_.
 *
 * This message type is based on the XJustiz KLAVER module, using the generic
 * message type `nachricht.klaver.klageverfahren.3500001` with the
 * specialization of an `anderes Klageverfahren`.
 *
 * **ATTENTION:**
 * This is still under construction. It acts as exemplary entry point, without
 * producing a valid message.
 */
export function zahlungsklage(name: DatatypeA, addresse: DatatypeB): string {
  return `<nachricht.klaver.klageverfahren.3500001>Name: ${name}; Addresse: ${addresse}</<nachricht.klaver.klageverfahren.3500001>`;
}

export { type DatatypeA, datatypeA, type DatatypeB, datatypeB };
