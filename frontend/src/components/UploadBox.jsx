import { useRef, useState } from "react";
import Button from "./Button";
import Card from "./Card";

export default function UploadBox({ onProcess, processing }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  };

  const handleSubmit = async () => {
    if (!file || !preview) {
      return;
    }

    await onProcess({ file, image: preview });
  };

  return (
    <Card className="p-6">
      <div
        className="relative overflow-hidden rounded-[2rem] border border-dashed border-sky-200/70 bg-gradient-to-br from-white/70 to-sky-100/60 p-6 dark:border-sky-400/20 dark:from-white/5 dark:to-sky-400/10"
      >
        <div className="absolute inset-0 bg-aurora opacity-80" />
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-200">
                Prescription intake
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                Upload a prescription and trigger mock OCR validation
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Drop a JPG or PNG prescription. The app will simulate OCR extraction, validate medicine names, and prepare the interaction report.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => inputRef.current?.click()} variant="secondary">
                  Select file
                </Button>
                <Button onClick={handleSubmit} disabled={!file || processing}>
                  {processing ? "Processing..." : "Check validity"}
                </Button>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              {file ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Ready to process: <span className="font-medium">{file.name}</span>
                </p>
              ) : null}
            </div>

            <div className="w-full max-w-sm">
              <div className="glass-panel flex min-h-64 items-center justify-center rounded-[2rem] p-3">
                {preview ? (
                  <img
                    src={preview}
                    alt="Prescription preview"
                    className="h-full max-h-64 w-full rounded-[1.5rem] object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-white/70 dark:bg-white/10" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Prescription preview appears here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
