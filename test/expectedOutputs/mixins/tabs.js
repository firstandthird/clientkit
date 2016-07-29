module.exports={
  "display": "flex",
  "flex-wrap": "wrap",
  "max-width": "100%",
  "position": "relative",
  "list-style": "none",
  "border-radius": "12",
  "& .tab": {
    "display": "none",
    "&:first-of-type:not(:last-of-type) + label": {
      "border-top-right-radius": "0",
      "border-bottom-right-radius": "0"
    },
    "&:not(:first-of-type):not(:last-of-type) + label": {
      "border-radius": "0"
    },
    "&:last-of-type:not(:first-of-type) + label": {
      "border-top-left-radius": "0",
      "border-bottom-left-radius": "0"
    },
    "&:checked + label": {
      "cursor": "default"
    },
    "& + label": {
      "box-sizing": "border-box",
      "display": "block",
      "flex-grow": "3",
      "border-radius": "12 12 0 0",
      "text-decoration": "none",
      "cursor": "pointer",
      "user-select": "none"
    },
    "&-content": {
      "position": "absolute",
      "left": 0,
      "z-index": "-1",
      "width": "100%",
      "border-radius": "12",
      "opacity": 0,
      "transform": "translateY(-3px)"
    }
  },
  "& .tab:checked:nth-of-type(1) ~ .tab-content:nth-of-type(1)": {
    "position": "relative",
    "top": "0",
    "z-index": "100",
    "opacity": "1",
    "transform": "translateY(0px)",
    "transition": "0.5s opacity ease-in, 0.8s transform ease"
  },
  "& .tab:checked:nth-of-type(2) ~ .tab-content:nth-of-type(2)": {
    "position": "relative",
    "top": "0",
    "z-index": "100",
    "opacity": "1",
    "transform": "translateY(0px)",
    "transition": "0.5s opacity ease-in, 0.8s transform ease"
  },
  "& .tab:checked:nth-of-type(3) ~ .tab-content:nth-of-type(3)": {
    "position": "relative",
    "top": "0",
    "z-index": "100",
    "opacity": "1",
    "transform": "translateY(0px)",
    "transition": "0.5s opacity ease-in, 0.8s transform ease"
  }
};