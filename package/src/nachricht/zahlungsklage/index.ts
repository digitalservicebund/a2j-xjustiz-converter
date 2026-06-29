export function zahlungsklage(streitwert: number): string {
  return `<nachricht.klaver.klageverfahren.3500001>${streitwert}</<nachricht.klaver.klageverfahren.3500001>`;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("just works fine", () => {
    const nachricht = zahlungsklage(1);

    expect(nachricht).toEqual(
      "<nachricht.klaver.klageverfahren.3500001>1</<nachricht.klaver.klageverfahren.3500001>",
    );
  });
}
