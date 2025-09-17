
export const googleSuccess = (req, res) => {
  res.json({ message: "Login successful 😎", user: req.user });
};

export const googleFailure = (req, res) => {
  res.status(401).json({ message: "Login failed ❌" });
};

export const logoutUser = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out ✅" });
  });
};
