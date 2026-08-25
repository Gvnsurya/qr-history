import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import {
  createQRCode,
  getQRHistory,
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
  const [url, setUrl] = useState("");
  const [history, setHistory] = useState<QRCodeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  // --------------------------------------------------
  // LOAD QR HISTORY
  // --------------------------------------------------

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
    loadHistory();
  }, []);

  // --------------------------------------------------
  // GENERATE QR CODE
  // --------------------------------------------------

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
          url,
        },
      });

      setUrl("");
      await loadHistory();
    } catch (err) {
      console.error(err);
      setError("Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SELECT / UNSELECT QR CODE
  // --------------------------------------------------

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      return [...current, id];
    });
  };

  // --------------------------------------------------
  // SELECT ALL
  // --------------------------------------------------

  const toggleSelectAll = () => {
    if (selectedIds.length === history.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map((item) => item.id));
    }
  };

  // --------------------------------------------------
  // BULK EXPORT
  // --------------------------------------------------

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

  // --------------------------------------------------
  // DOWNLOAD SINGLE QR CODE
  // --------------------------------------------------

  const downloadQRCode = (item: QRCodeRecord) => {
    const link = document.createElement("a");

    link.href = item.pngDataUrl;
    link.download = "qr-code.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <h1 className="mb-2 text-4xl font-bold">
          QR Generator
        </h1>

        <p className="mb-8 text-gray-600">
          Generate QR codes and keep your history in Neon PostgreSQL.
        </p>

        {/* GENERATE SECTION */}
        <section className="mb-10 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-2xl font-semibold">
            Generate QR Code
          </h2>

          <div className="flex gap-3">

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
              {loading ? "Generating..." : "Generate"}
            </button>

          </div>

          {error && (
            <p className="mt-3 text-red-600">
              {error}
            </p>
          )}

        </section>

        {/* HISTORY HEADER */}
        <section>

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-2xl font-semibold">
              QR History
            </h2>

            {history.length > 0 && (
              <div className="flex items-center gap-3">

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
                    exporting || selectedIds.length === 0
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {exporting
                    ? "Exporting..."
                    : `Export Selected (${selectedIds.length})`}
                </button>

              </div>
            )}

          </div>

          {/* NO HISTORY */}
          {history.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
              No QR codes generated yet.
            </div>
          ) : (

            /* QR GRID */
            <div className="grid gap-6 md:grid-cols-2">

              {history.map((item) => {

                const isSelected = selectedIds.includes(item.id);

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
                      alt="QR Code"
                      className="mx-auto mb-4 h-48 w-48"
                    />

                    {/* URL */}
                    <p className="mb-4 break-all text-sm text-gray-700">
                      {item.url}
                    </p>

                    {/* DOWNLOAD */}
                    <button
                      onClick={() => downloadQRCode(item)}
                      className="w-full rounded-lg bg-gray-900 px-4 py-2 text-white"
                    >
                      Download QR
                    </button>

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