"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PageShell from "../../components/mui/PageShell";
import SectionCard from "../../components/mui/SectionCard";
import Alert from "@mui/material/Alert";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage("");

    if (!supabase) {
      setErrorMessage("Login is unavailable right now.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/admin");
  }

  return (
    <PageShell maxWidth="lg">
      <Box
        sx={{
          minHeight: "calc(100vh - 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SectionCard sx={{ width: "100%", maxWidth: 520 }}>
          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Admin Login
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Sign in to manage sprint releases.
                </Typography>
              </Box>

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <TextField
                required
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                required
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" variant="contained" color="primary" size="large">
                Login
              </Button>
            </Stack>
          </Box>
        </SectionCard>
      </Box>
    </PageShell>
  );
}