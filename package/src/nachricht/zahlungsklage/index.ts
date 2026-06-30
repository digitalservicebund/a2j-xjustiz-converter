export function zahlungsklage(streitwert: number): string {
  return `<nachricht.klaver.klageverfahren.3500001>${streitwert}</<nachricht.klaver.klageverfahren.3500001>`;
}
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Zahlungsklage", async () => {
    const {
      assert,
      property,
      integer: arbitraryInteger,
    } = await import("fast-check");

    it("just works fine", () => {
      const nachricht = zahlungsklage(1);

      expect(nachricht).toEqual(
        "<nachricht.klaver.klageverfahren.3500001>1</<nachricht.klaver.klageverfahren.3500001>",
      );
    });

    it("always includes the Streitwert in the Nachricht", () => {
      assert(
        property(arbitraryInteger(), (streitwert) => {
          const nachricht = zahlungsklage(streitwert);

          expect(nachricht).toContain(streitwert);
        }),
      );
    });
  });
}
