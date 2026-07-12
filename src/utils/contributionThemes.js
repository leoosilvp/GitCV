export const CONTRIBUTION_THEMES = {
    "github-dark": {
        label: "GitHub Dark",
        colors: ["#1a1a1a", "#033a15", "#196c2e", "#2da043", "#56d364"],
    },
    carbon: {
        label: "Carbon",
        colors: ["#1a1a1a", "#444444", "#777777", "#999999", "#dbdbdb"],
    },
    dracula: {
        label: "Dracula",
        colors: ["#1a1a1a", "#45475a", "#6272a4", "#be93f9", "#ff79c6"],
    },
    crimson: {
        label: "Crimson",
        colors: ["#1a1a1a", "#3B0D13", "#7F1D1D", "#B91C1C", "#EF4444"],
    },
    pink: {
        label: "Pink",
        colors: ["#1A1A1A", "#ef027f", "#ff59af", "#fe84c4", "#ffb0de"]
    },
    panda: {
        label: "Panda",
        colors: ["#1a1a1a", "#33353b", "#6fc1ff", "#1af9d8", "#ff4b82"],
    },
    blue: {
        label: "Blue",
        colors: ["#1A1A1A", "#2B3B52", "#40648A", "#5886BE", "#7bb4f1"]
    },
}

export const DEFAULT_CONTRIBUTION_THEME = "github-dark"

export const CONTRIBUTION_THEME_ORDER = [
    "github-dark",
    "carbon",
    "dracula",
    "crimson",
    "pink",
    "panda",
    "blue",
]

export const buildContributionThemeStyle = (theme) => {
    const { colors } = CONTRIBUTION_THEMES[theme] ?? CONTRIBUTION_THEMES[DEFAULT_CONTRIBUTION_THEME]

    return {
        "--contributionPanel-level0": colors[0],
        "--contributionPanel-level1": colors[1],
        "--contributionPanel-level2": colors[2],
        "--contributionPanel-level3": colors[3],
        "--contributionPanel-level4": colors[4],
    }
}