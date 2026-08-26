import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import JSZip from "jszip";

import { authClient } from "../lib/auth-client";

import {
  createQRCode,
  getQRHistory,
  deleteQRCode,
  clearAllQRCodes,
} from "../server/qr.functions";

type QRCodeRecord = {
  id: string;
  url: string;
  pngDataUrl: string;
  createdAt: string | Date;
};

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [history, setHistory] = useState<QRCodeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  const [user, setUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);

  // CHECK LOGIN SESSION
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (!data?.user) {
          navigate({
            to: "/login",
          });
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Session error:", err);

        navigate({
          to: "/login",
        });
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  // LOAD QR HISTORY
  const loadHistory = async () => {
    try {
      const rows = await getQRHistory();

      setHistory(rows as QRCodeRecord[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load QR history.");
    }
  };

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  // GENERATE QR CODE
  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createQRCode({
        data: {
          url: url.trim(),
        },
      });

      setUrl("");

      await loadHistory();
    } catch (err) {
      console.error(err);

      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Failed to generate QR code.");
      }
    } finally {
      setLoading(false);
    }
  };

  // SELECT / UNSELECT QR CODE
  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (selectedId) => selectedId !== id
        );
      }

      return [...current, id];
    });
  };

  // SELECT ALL
  const toggleSelectAll = () => {
    if (
      history.length > 0 &&
      selectedIds.length === history.length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map((item) => item.id));
    }
  };

  // BULK EXPORT
  const handleBulkExport = async () => {
    const selectedItems = history.filter((item) =>
      selectedIds.includes(item.id)
    );

    if (selectedItems.length === 0) {
      setError("Please select at least one QR code.");
      return;
    }

    setExporting(true);
    setError("");

    try {
      const zip = new JSZip();

      for (const item of selectedItems) {
        const response = await fetch(item.pngDataUrl);
        const blob = await response.blob();

        zip.file(`qr-${item.id}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const downloadUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "qr-codes.zip";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      setError("Failed to export QR codes.");
    } finally {
      setExporting(false);
    }
  };

  // DELETE SINGLE QR CODE
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this QR code?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteQRCode({
        data: {
          id,
        },
      });

      setHistory((current) =>
        current.filter((item) => item.id !== id)
      );

      setSelectedIds((current) =>
        current.filter(
          (selectedId) => selectedId !== id
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete QR code.");
    }
  };

  // CLEAR ALL QR CODES
  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL QR codes? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await clearAllQRCodes();

      setHistory([]);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      setError("Failed to clear QR history.");
    }
  };

  // DOWNLOAD SINGLE QR CODE
  const downloadQRCode = (item: QRCodeRecord) => {
    const link = document.createElement("a");

    link.href = item.pngDataUrl;
    link.download = `qr-${item.id}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      navigate({
        to: "/login",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // WAIT WHILE CHECKING LOGIN
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 p-8">
      {/* ANIMATED BACKGROUND */}
      <div
        className="animated-background"
        aria-hidden="true"
      >
        <span className="color-ball ball-1" />
        <span className="color-ball ball-2" />
        <span className="color-ball ball-3" />
        <span className="color-ball ball-4" />
        <span className="color-ball ball-5" />
        <span className="color-ball ball-6" />
      </div>

      {/* APPLICATION */}
      <div className="relative z-10 mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
              QR Generator
            </h1>

            <p className="text-gray-600">
              Generate QR codes and keep your history in Neon PostgreSQL.
            </p>
          </div>

          {/* USER SECTION */}
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-white px-4 py-2 shadow">
              <p className="font-semibold">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-3 text-white transition hover:bg-red-700"
            >
              Logout
            </button>

          </div>
        </div>

        {/* GENERATE SECTION */}
        <section className="mb-10 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">
            Generate QR Code
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border px-4 py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGenerate();
                }
              }}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading
                ? "Generating..."
                : "Generate"}
            </button>

          </div>

          {error && (
            <p
              className="mt-3 text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        </section>

        {/* HISTORY */}
        <section>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="text-2xl font-semibold">
              QR History
            </h2>

            {history.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">

                <button
                  onClick={toggleSelectAll}
                  className="rounded-lg border bg-white px-4 py-2"
                >
                  {selectedIds.length === history.length
                    ? "Unselect All"
                    : "Select All"}
                </button>

                <button
                  onClick={handleBulkExport}
                  disabled={
                    exporting ||
                    selectedIds.length === 0
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {exporting
                    ? "Exporting..."
                    : `Export Selected (${selectedIds.length})`}
                </button>

                <button
                  onClick={handleClearAll}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Clear All
                </button>

              </div>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
              No QR codes generated yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">

              {history.map((item) => {
                const isSelected =
                  selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl bg-white p-6 shadow ${
                      isSelected
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >

                    {/* CHECKBOX */}
                    <div className="mb-4 flex items-center gap-2">

                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          toggleSelection(item.id)
                        }
                        className="h-5 w-5"
                      />

                      <span className="text-sm text-gray-600">
                        Select
                      </span>

                    </div>

                    {/* QR IMAGE */}
                    <img
                      src={item.pngDataUrl}
                      alt={`QR code for ${item.url}`}
                      className="mx-auto mb-4 h-48 w-48"
                    />

                    {/* URL */}
                    <p className="mb-4 break-all text-sm text-gray-700">
                      {item.url}
                    </p>

                    {/* DOWNLOAD AND DELETE */}
                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          downloadQRCode(item)
                        }
                        className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-white"
                      >
                        Download QR
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}