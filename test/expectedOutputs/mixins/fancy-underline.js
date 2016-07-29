module.exports={
  "color": "#111",
  "text-decoration": "none",
  "text-shadow": "-1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333",
  "background-image": "linear-gradient(bottom, transparent, transparent 10px, #111 10px, #111 22px, transparent 22px)",
  "transition": "color 200ms ease, background-image 200ms ease",
  "&:hover, &:focus": {
    "color": "#fff",
    "background-image": "linear-gradient(bottom, transparent, transparent 10px, #fff 10px, #fff 22px, transparent 22px)"
  },
  "&:active": {
    "color": "#fff",
    "background-image": "linear-gradient(bottom, transparent, transparent 25px, #fff 25px, #fff 37px, transparent 37px)"
  },
  "&:focus": {
    "outline": 0,
    "color": "#111"
  }
};