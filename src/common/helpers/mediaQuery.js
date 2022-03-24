
const mediaScreenSize = {
    desktopMin: "45em",
    mobileMax: "45em",
    mobileSmallMax: "20em"
}

const media = {
    desktop: `@media (min-width: ${mediaScreenSize.mobileMax})`,
    // tabs: "@media (min-width: ${mediaScreenSize.mobileMax}",
    mobile: `@media (max-width: ${mediaScreenSize.mobileMax})`,
    mobileSmall: `@media (max-width: ${mediaScreenSize.mobileSmallMax})`
}

export { media, mediaScreenSize };