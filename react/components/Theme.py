light_theme = {
  "palette": {
    "primary": {
      "main": "#4f3cc9"
    },
    "secondary": {
      "light": "#5f5fc4",
      "main": "#283593",
      "dark": "#001064",
      "contrastText": "#fff"
    },
    "background": {
      "default": "#fcfcfe"
    }
  },
  "shape": {
    "borderRadius": 10
  },
  "overrides": {
    "RaMenuItemLink": {
      "root": {
        "borderLeft": "3px solid #fff"
      },
      "active": {
        "borderLeft": "3px solid #4f3cc9"
      }
    },
    "MuiPaper": {
      "elevation1": {
        "boxShadow": "none"
      },
      "root": {
        "border": "1px solid #e0e0e3",
        "backgroundClip": "padding-box"
      }
    },
    "MuiButton": {
      "contained": {
        "backgroundColor": "#fff",
        "color": "#4f3cc9",
        "boxShadow": "none"
      }
    },
    "MuiButtonBase": {
      "root": {
        "&:hover:active::after": {
          "content": "\"\"",
          "display": "block",
          "width": "100%",
          "height": "100%",
          "position": "absolute",
          "top": 0,
          "right": 0,
          "backgroundColor": "currentColor",
          "opacity": 0.3,
          "borderRadius": "inherit"
        }
      }
    },
    "MuiAppBar": {
      "colorSecondary": {
        "color": "#808080",
        "backgroundColor": "#fff"
      }
    },
    "MuiLinearProgress": {
      "colorPrimary": {
        "backgroundColor": "#f5f5f5"
      },
      "barColorPrimary": {
        "backgroundColor": "#d7d7d7"
      }
    },
    "MuiFilledInput": {
      "root": {
        "backgroundColor": "rgba(0, 0, 0, 0.04)",
        "&$disabled": {
          "backgroundColor": "rgba(0, 0, 0, 0.04)"
        }
      }
    },
    "MuiSnackbarContent": {
      "root": {
        "border": "none"
      }
    }
  },
  "props": {
    "MuiButtonBase": {
      "disableRipple": True
    }
  }
}
