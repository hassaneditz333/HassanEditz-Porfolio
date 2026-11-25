import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  defaultContent,
  type PricingPlan,
  type SiteContent,
  type VideoItem,
  type WorkCategory,
  type WorkVideo,
} from "../content";
import {
  BadgeDollarSign,
  Check,
  ExternalLink,
  Image,
  LogOut,
  Menu,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";

type Section = "brand" | "videos" | "work" | "pricing";
const inputClass =
  "w-full rounded-xl border border-[#292929] bg-[#151515] px-3.5 py-3 text-[15px] text-white outline-none transition placeholder:text-[#606060] focus:border-[#555] focus:bg-[#181818]";
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const SUPPORTED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

function optimizedCloudinaryVideoUrl(url: string) {
  const marker = "/video/upload/";
  if (!url.includes(marker)) return url;
  return url.replace(marker, `${marker}q_auto/f_auto/`);
}

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
}) {
  const onInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange(event.target.value);
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#b8b8b8]">
        {label}
      </span>
      {textarea ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={onInput}
        />
      ) : (
        <input
          className={inputClass}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onInput}
        />
      )}
    </label>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  suffix = "%",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-[#292929] bg-[#111] p-4">
      <span className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-[#b8b8b8]">{label}</span>
        <span className="rounded-md bg-[#222] px-2 py-1 text-xs text-white">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer accent-white"
      />
    </label>
  );
}

function VideoUpload({
  uploadKey,
  activeKey,
  progress,
  onSelect,
  onCancel,
}: {
  uploadKey: string;
  activeKey: string;
  progress: number;
  onSelect: (file?: File) => void;
  onCancel: () => void;
}) {
  const uploading = activeKey === uploadKey;
  return (
    <div>
      <div className="flex gap-2">
        <label className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-sm transition ${uploading ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : activeKey ? "cursor-not-allowed border-[#292929] text-[#555]" : "border-[#3a3a3a] text-[#aaa] hover:border-[#666] hover:bg-[#171717] hover:text-white"}`}>
          <UploadCloud size={17} />
          <span>{uploading ? `Uploading ${progress}%` : "Upload / replace video"}</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v,.mov,.m4v"
            disabled={Boolean(activeKey)}
            className="hidden"
            onChange={(event) => {
              onSelect(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </label>
        {uploading && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-xl border border-red-400/25 px-3 text-sm text-red-300 transition hover:bg-red-950/30"
          >
            Cancel
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-[#666]">
        MP4, WebM, MOV or M4V · Maximum 100MB
      </p>
    </div>
  );
}

function InlineEdit({
  value,
  onChange,
  className = "",
  multiline = false,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  ariaLabel: string;
}) {
  const shared = `w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 outline-none transition hover:border-white/15 hover:bg-white/[.03] focus:border-cyan-400/50 focus:bg-black/40 ${className}`;
  return multiline ? (
    <textarea
      aria-label={ariaLabel}
      rows={2}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${shared} resize-none`}
    />
  ) : (
    <input
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={shared}
    />
  );
}

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-[15px] text-[#888]">{description}</p>
        </div>
        {action}
      </div>
      <div className="rounded-2xl border border-[#242424] bg-[#0b0b0b] p-5 md:p-7">
        {children}
      </div>
    </div>
  );
}

export default function Admin() {
  const adminEmail = "hassaneditz333@gmail.com";
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [authStep, setAuthStep] = useState<
    "login" | "forgot" | "verify" | "reset"
  >("login");
  const [data, setData] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState("");
  const [section, setSection] = useState<Section>("brand");
  const [mobileNav, setMobileNav] = useState(false);
  const [desktopNav, setDesktopNav] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [uploadingVideo, setUploadingVideo] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    title: string;
    description: string;
    confirm: () => void;
  } | null>(null);
  const [deletePhrase, setDeletePhrase] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const uploadRequestRef = useRef<XMLHttpRequest | null>(null);
  const uploadCancelledRef = useRef(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    imageX: number;
    imageY: number;
    moved: boolean;
  } | null>(null);

  async function load() {
    try {
      const response = await fetch("/api/admin/content", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      const content = await response.json();
      setData(content);
      setSaved(JSON.stringify(content));
    } catch {
      setData(null);
    } finally {
      setChecking(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!uploadingVideo) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [uploadingVideo]);

  async function requestCode() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/request-code", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to send code");
      setAuthStep("verify");
      setMessage("Reset code sent. Check your inbox or spam folder.");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to send code",
      );
    } finally {
      setBusy(false);
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Login failed");
      setPassword("");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function verifyResetCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/verify-reset-code", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Invalid or expired code");
      setResetToken(result.resetToken);
      setAuthStep("reset");
      setCode("");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to verify code",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resetAdminPassword(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          password: newPassword,
          confirmPassword,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Unable to reset password");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setAuthStep("login");
      setMessage("Password updated. You can now sign in.");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to reset password",
      );
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!data) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to publish");
      setData(result);
      setSaved(JSON.stringify(result));
      setMessage("Changes published successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to publish");
    } finally {
      setBusy(false);
    }
  }

  async function replaceHeroImage(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setError("");
    try {
      const source = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const next = new window.Image();
        next.onload = () => resolve(next);
        next.onerror = reject;
        next.src = source;
      });
      const maxSize = 900;
      const scale = Math.min(
        1,
        maxSize / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas
        .getContext("2d")
        ?.drawImage(image, 0, 0, canvas.width, canvas.height);
      let imageUrl = canvas.toDataURL("image/jpeg", 0.82);
      if (imageUrl.length > 700_000)
        imageUrl = canvas.toDataURL("image/jpeg", 0.62);
      if (imageUrl.length > 900_000)
        throw new Error(
          "This image is too large. Please choose a smaller image.",
        );
      setData((current) =>
        current
          ? {
              ...current,
              hero: {
                ...current.hero,
                imageUrl,
                imageX: 50,
                imageY: 50,
                imageZoom: 110,
              },
            }
          : current,
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to process this image",
      );
    }
  }

  async function uploadVideo(
    file: File | undefined,
    key: string,
    onUploaded: (video: string, publicId: string) => void,
  ) {
    if (!file) return;
    const supportedExtension = /\.(mp4|webm|mov|m4v)$/i.test(file.name);
    if ((!SUPPORTED_VIDEO_TYPES.has(file.type) && !supportedExtension)) {
      setError("Unsupported video. Choose an MP4, WebM, MOV or M4V file.");
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError("This video is larger than 100MB. Compress it before uploading.");
      return;
    }
    uploadCancelledRef.current = false;
    setUploadingVideo(key);
    setUploadProgress(0);
    setError("");
    setMessage("");
    try {
      const signatureResponse = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
        credentials: "same-origin",
      });
      const signed = await signatureResponse.json().catch(() => ({}));
      if (!signatureResponse.ok) {
        const configurationMissing = String(signed.error || "").includes(
          "not configured",
        );
        throw new Error(
          configurationMissing
            ? "Cloudinary is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Vercel."
            : signed.error || "Unable to start video upload",
        );
      }
      if (uploadCancelledRef.current) throw new Error("Upload cancelled.");

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signed.apiKey);
      form.append("timestamp", String(signed.timestamp));
      form.append("folder", signed.folder);
      form.append("signature", signed.signature);

      const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const request = new XMLHttpRequest();
        uploadRequestRef.current = request;
        request.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`);
        request.upload.onprogress = (event) => {
          if (event.lengthComputable)
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };
        request.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
        request.onabort = () => reject(new Error("Upload cancelled."));
        request.onload = () => {
          const result = JSON.parse(request.responseText || "{}");
          if (request.status < 200 || request.status >= 300)
            reject(new Error(result.error?.message || "Cloudinary upload failed"));
          else resolve(result);
        };
        request.send(form);
      });
      onUploaded(
        optimizedCloudinaryVideoUrl(uploaded.secure_url),
        uploaded.public_id,
      );
      setMessage("Video uploaded. Publish changes to make it live and remove the old video.");
    } catch (reason) {
      const reasonMessage = reason instanceof Error ? reason.message : "Unable to upload video";
      if (reasonMessage === "Upload cancelled.") setMessage(reasonMessage);
      else setError(reasonMessage);
    } finally {
      uploadRequestRef.current = null;
      setUploadingVideo("");
      setUploadProgress(0);
    }
  }

  function cancelVideoUpload() {
    uploadCancelledRef.current = true;
    uploadRequestRef.current?.abort();
    if (!uploadRequestRef.current) {
      setUploadingVideo("");
      setUploadProgress(0);
      setMessage("Upload cancelled.");
    }
  }

  if (checking)
    return (
      <main className="grid min-h-screen place-items-center bg-black text-sm text-[#777]">
        Checking secure session...
      </main>
    );
  if (!data) {
    const titles = {
      login: "Admin access",
      forgot: "Reset password",
      verify: "Check your email",
      reset: "Create new password",
    };
    const descriptions = {
      login: "Sign in with your administrator account.",
      forgot: "We will send a one-time code to your email.",
      verify: "Enter the 6-digit code sent by Resend.",
      reset: "Choose a strong new password for your account.",
    };
    const goTo = (step: typeof authStep) => {
      setAuthStep(step);
      setError("");
      setMessage("");
    };
    return (
      <main className="grid min-h-screen place-items-center bg-black px-4 py-10 text-white">
        <div className="w-full max-w-[430px] rounded-2xl border border-[#262626] bg-[#0b0b0b] p-7 md:p-9">
          <div className="mb-7 grid size-11 place-items-center rounded-xl border border-[#303030] bg-[#171717]">
            <ShieldCheck size={21} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {titles[authStep]}
          </h1>
          <p className="mb-8 mt-2 text-sm text-[#888]">
            {descriptions[authStep]}
          </p>
          {authStep === "login" && (
            <form onSubmit={login} className="space-y-4">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="Password"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={setPassword}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => goTo("forgot")}
                  className="text-sm text-[#999] hover:text-white"
                >
                  Forgot password?
                </button>
              </div>
              <button
                disabled={
                  busy || !password || email.toLowerCase() !== adminEmail
                }
                className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-[#ddd] disabled:opacity-40"
              >
                {busy ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}
          {authStep === "forgot" && (
            <div className="space-y-4">
              <Field
                label="Administrator email"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <button
                type="button"
                onClick={requestCode}
                disabled={busy || email.toLowerCase() !== adminEmail}
                className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-[#ddd] disabled:opacity-40"
              >
                {busy ? "Sending code..." : "Send reset code"}
              </button>
              <button
                type="button"
                onClick={() => goTo("login")}
                className="w-full py-2 text-sm text-[#888] hover:text-white"
              >
                Back to sign in
              </button>
            </div>
          )}
          {authStep === "verify" && (
            <form onSubmit={verifyResetCode} className="space-y-4">
              <div className="rounded-xl border border-[#292929] bg-[#141414] px-4 py-3 text-sm text-[#aaa]">
                Code sent to <span className="text-white">{email}</span>
              </div>
              <Field
                label="One-time code"
                value={code}
                placeholder="000000"
                onChange={(value) =>
                  setCode(value.replace(/\D/g, "").slice(0, 6))
                }
              />
              <button
                disabled={busy || code.length !== 6}
                className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-[#ddd] disabled:opacity-40"
              >
                {busy ? "Verifying..." : "Verify code"}
              </button>
              <button
                type="button"
                onClick={requestCode}
                disabled={busy}
                className="w-full py-2 text-sm text-[#888] hover:text-white"
              >
                Send code again
              </button>
            </form>
          )}
          {authStep === "reset" && (
            <form onSubmit={resetAdminPassword} className="space-y-4">
              <Field
                label="New password"
                type="password"
                value={newPassword}
                placeholder="At least 12 characters"
                onChange={setNewPassword}
              />
              <Field
                label="Confirm password"
                type="password"
                value={confirmPassword}
                placeholder="Repeat new password"
                onChange={setConfirmPassword}
              />
              <button
                disabled={
                  busy ||
                  newPassword.length < 12 ||
                  newPassword !== confirmPassword
                }
                className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-[#ddd] disabled:opacity-40"
              >
                {busy ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
          {message && (
            <p className="mt-4 text-sm text-emerald-400">{message}</p>
          )}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <a
            href="/"
            className="mt-7 block text-center text-sm text-[#777] hover:text-white"
          >
            Back to website
          </a>
        </div>
      </main>
    );
  }

  const dirty = JSON.stringify(data) !== saved;
  const requestDelete = (
    title: string,
    description: string,
    confirm: () => void,
  ) => {
    setDeletePhrase("");
    setDeleteConfirmation({ title, description, confirm });
  };
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation(null);
    setDeletePhrase("");
  };
  const updateHero = (key: keyof SiteContent["hero"], value: string | number) =>
    setData({ ...data, hero: { ...data.hero, [key]: value } });
  const updateVideo = (index: number, patch: Partial<VideoItem>) =>
    setData({
      ...data,
      showcase: {
        ...data.showcase,
        videos: data.showcase.videos.map((item, position) =>
          position === index ? { ...item, ...patch } : item,
        ),
      },
    });
  const updatePlan = (index: number, patch: Partial<PricingPlan>) =>
    setData({
      ...data,
      pricing: {
        ...data.pricing,
        plans: data.pricing.plans.map((item, position) =>
          position === index ? { ...item, ...patch } : item,
        ),
      },
    });
  const updateWorkCategory = (index: number, patch: Partial<WorkCategory>) =>
    setData({
      ...data,
      workCategories: data.workCategories.map((item, position) =>
        position === index ? { ...item, ...patch } : item,
      ),
    });
  const updateWorkVideo = (
    categoryIndex: number,
    videoIndex: number,
    patch: Partial<WorkVideo>,
  ) =>
    setData({
      ...data,
      workCategories: data.workCategories.map((category, position) =>
        position === categoryIndex
          ? {
              ...category,
              videos: category.videos.map((video, index) =>
                index === videoIndex ? { ...video, ...patch } : video,
              ),
            }
          : category,
      ),
    });
  const nav = [
    { id: "brand" as const, label: "Brand & hero", icon: Image },
    { id: "videos" as const, label: "Videos", icon: Video },
    { id: "work" as const, label: "Work portfolio", icon: Video },
    { id: "pricing" as const, label: "Pricing", icon: BadgeDollarSign },
  ];

  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[270px] border-r border-[#202020] bg-black p-4 transition-transform duration-300 ${mobileNav ? "translate-x-0" : "-translate-x-full"} ${desktopNav ? "md:translate-x-0" : "md:-translate-x-full"}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-2 py-3">
          <div>
            <p className="font-semibold">{data.brandName}</p>
            <p className="text-xs text-[#666]">Website admin</p>
          </div>
          <button
            onClick={() =>
              window.innerWidth >= 768
                ? setDesktopNav(false)
                : setMobileNav(false)
            }
            className="rounded-lg border border-[#292929] p-2 text-[#888] transition hover:bg-[#171717] hover:text-white"
            aria-label="Collapse admin menu"
          >
            <Menu size={18} />
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSection(id);
                setMobileNav(false);
                setMessage("");
                setError("");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${section === id ? "bg-[#1a1a1a] text-white" : "text-[#8b8b8b] hover:bg-[#111] hover:text-white"}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="my-5 border-t border-[#202020]" />
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#8b8b8b] hover:bg-[#111] hover:text-white"
        >
          <ExternalLink size={18} />
          View website
        </a>
        <div className="mt-auto border-t border-[#202020] pt-4">
          <div className="mb-3 flex items-center gap-2 px-3 text-xs">
            <span
              className={`size-2 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-400"}`}
            />
            <span className={dirty ? "text-amber-300" : "text-[#777]"}>
              {dirty ? "Unsaved changes" : "All changes published"}
            </span>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", {
                method: "POST",
                credentials: "same-origin",
              });
              setData(null);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#8b8b8b] hover:bg-[#111] hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {deleteConfirmation && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirmation-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDeleteConfirmation();
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-red-500/25 bg-[#111] p-6 shadow-2xl md:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-400">
                <Trash2 size={20} />
              </div>
              <button
                type="button"
                aria-label="Close deletion confirmation"
                onClick={closeDeleteConfirmation}
                className="rounded-lg p-2 text-[#777] hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <h2 id="delete-confirmation-title" className="text-xl font-semibold">
              {deleteConfirmation.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#999]">
              {deleteConfirmation.description}
            </p>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm text-[#bbb]">
                Type <strong className="select-all text-white">hassaneditz</strong> to confirm
              </span>
              <input
                autoFocus
                value={deletePhrase}
                onChange={(event) => setDeletePhrase(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeDeleteConfirmation();
                }}
                placeholder="hassaneditz"
                autoComplete="off"
                className={inputClass}
              />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                className="rounded-xl border border-[#333] px-4 py-2.5 text-sm text-[#bbb] hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletePhrase !== "hassaneditz"}
                onClick={() => {
                  if (deletePhrase !== "hassaneditz") return;
                  deleteConfirmation.confirm();
                  closeDeleteConfirmation();
                }}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
      {sidebar}
      {mobileNav && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}
      {!mobileNav && (
        <button
          onClick={() => setMobileNav(true)}
          className="fixed left-4 top-4 z-40 rounded-xl border border-[#292929] bg-black p-3 text-[#aaa] shadow-xl transition hover:bg-[#171717] hover:text-white md:hidden"
          aria-label="Open admin menu"
        >
          <Menu size={19} />
        </button>
      )}
      {!desktopNav && (
        <button
          onClick={() => setDesktopNav(true)}
          className="fixed left-4 top-4 z-40 hidden rounded-xl border border-[#292929] bg-black p-3 text-[#aaa] shadow-xl transition hover:bg-[#171717] hover:text-white md:block"
          aria-label="Open admin menu"
        >
          <Menu size={19} />
        </button>
      )}
      <div
        className={`transition-[padding] duration-300 ${desktopNav ? "md:pl-[270px]" : "md:pl-0"}`}
      >
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#202020] bg-black/90 px-4 backdrop-blur md:px-9">
          <div
            className={`ml-16 text-sm text-[#777] transition-[margin] duration-300 ${desktopNav ? "md:ml-0" : "md:ml-16"}`}
          >
            Content management
          </div>
          <button
            onClick={publish}
            disabled={busy || Boolean(uploadingVideo) || !dirty}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ddd] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Save size={16} />
            {uploadingVideo ? "Video uploading..." : busy ? "Publishing..." : "Publish changes"}
          </button>
        </header>
        <div className="mx-auto max-w-[1180px] px-4 py-9 md:px-9 md:py-12">
          {message && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
              <Check size={16} />
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {section === "brand" && (
            <Panel
              title="Brand & hero"
              description="Manage the identity and first impression of your website."
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="grid items-center gap-4 border-b border-white/10 px-5 py-4 lg:grid-cols-[1fr_auto_1fr]">
                  <div className="hidden items-center gap-4 text-xs text-gray-400 lg:flex">
                    <span className="text-cyan-400">Home</span>
                    <span>Work</span>
                    <span>Services</span>
                    <span>Process</span>
                    <span>About</span>
                    <span>Pricing</span>
                  </div>
                  <InlineEdit
                    ariaLabel="Brand name"
                    value={data.brandName}
                    onChange={(brandName) => setData({ ...data, brandName })}
                    className="mx-auto max-w-[240px] text-center text-xl font-bold"
                  />
                  <div className="hidden justify-end lg:flex">
                    <div className="w-[120px] shrink-0 rounded-full border border-cyan-400/30 px-3 py-1">
                      <InlineEdit
                        ariaLabel="Navbar call to action"
                        value={data.navCtaText || "Let's Talk"}
                        onChange={(navCtaText) =>
                          setData({ ...data, navCtaText })
                        }
                        className="text-center text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative grid min-h-[590px] items-center gap-10 overflow-hidden px-6 py-12 lg:grid-cols-2 lg:px-12">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                      background:
                        "radial-gradient(circle at 25% 25%, rgba(99,102,241,.16), transparent 35%), radial-gradient(circle at 75% 75%, rgba(6,182,212,.12), transparent 35%)",
                    }}
                  />
                  <div className="relative z-10">
                    <InlineEdit
                      ariaLabel="Hero heading line 1"
                      value={data.hero.line1}
                      onChange={(value) => updateHero("line1", value)}
                      className="text-4xl font-bold leading-none tracking-tight sm:text-5xl"
                    />
                    <InlineEdit
                      ariaLabel="Hero heading line 2"
                      value={data.hero.line2}
                      onChange={(value) => updateHero("line2", value)}
                      className="text-4xl font-bold leading-none tracking-tight sm:text-5xl"
                    />
                    <InlineEdit
                      ariaLabel="Hero highlighted heading"
                      value={data.hero.accent}
                      onChange={(value) => updateHero("accent", value)}
                      className="text-4xl font-bold leading-none tracking-tight text-cyan-400 sm:text-5xl"
                    />
                    <InlineEdit
                      ariaLabel="Hero introduction"
                      multiline
                      value={data.hero.description}
                      onChange={(value) => updateHero("description", value)}
                      className="mt-5 min-h-24 max-w-xl text-base leading-relaxed text-gray-400"
                    />
                    <div className="mt-6 flex flex-wrap gap-3">
                      <div className="min-w-[160px] rounded-full bg-cyan-400 px-4 py-2 text-black">
                        <InlineEdit
                          ariaLabel="Primary hero button"
                          value={data.hero.primaryButtonText || "View My Work"}
                          onChange={(value) =>
                            updateHero("primaryButtonText", value)
                          }
                          className="text-center text-sm font-semibold"
                        />
                      </div>
                      <div className="min-w-[160px] rounded-full border border-white/15 px-4 py-2">
                        <InlineEdit
                          ariaLabel="Secondary hero button"
                          value={
                            data.hero.secondaryButtonText || "Start a Project"
                          }
                          onChange={(value) =>
                            updateHero("secondaryButtonText", value)
                          }
                          className="text-center text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 flex justify-center">
                    <div
                      className="group relative aspect-square w-full max-w-[340px] touch-none cursor-grab overflow-hidden rounded-full border-2 border-indigo-400/50 shadow-[0_0_50px_rgba(6,182,212,.15)] transition-[border-color,box-shadow] hover:border-cyan-300/80 hover:shadow-[0_0_60px_rgba(6,182,212,.22)] active:cursor-grabbing"
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        dragRef.current = {
                          startX: event.clientX,
                          startY: event.clientY,
                          imageX: data.hero.imageX ?? 50,
                          imageY: data.hero.imageY ?? 12,
                          moved: false,
                        };
                      }}
                      onPointerMove={(event) => {
                        const drag = dragRef.current;
                        if (!drag) return;
                        const rect =
                          event.currentTarget.getBoundingClientRect();
                        const dx =
                          ((event.clientX - drag.startX) / rect.width) * 100;
                        const dy =
                          ((event.clientY - drag.startY) / rect.height) * 100;
                        if (Math.abs(dx) > 1 || Math.abs(dy) > 1)
                          drag.moved = true;
                        setData((current) =>
                          current
                            ? {
                                ...current,
                                hero: {
                                  ...current.hero,
                                  imageX: Math.max(
                                    0,
                                    Math.min(100, drag.imageX - dx),
                                  ),
                                  imageY: Math.max(
                                    0,
                                    Math.min(100, drag.imageY - dy),
                                  ),
                                },
                              }
                            : current,
                        );
                      }}
                      onPointerUp={(event) => {
                        event.currentTarget.releasePointerCapture(
                          event.pointerId,
                        );
                        const moved = dragRef.current?.moved;
                        dragRef.current = null;
                        if (!moved) imageInputRef.current?.click();
                      }}
                      onPointerCancel={() => {
                        dragRef.current = null;
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "copy";
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        void replaceHeroImage(event.dataTransfer.files?.[0]);
                      }}
                      title="Drag to reposition. Click to replace."
                    >
                      <img
                        src={data.hero.imageUrl}
                        alt="Hero preview"
                        draggable={false}
                        className="pointer-events-none h-full w-full select-none object-cover will-change-transform"
                        style={{
                          objectPosition: `${data.hero.imageX ?? 50}% ${data.hero.imageY ?? 12}%`,
                          transform: `scale(${(data.hero.imageZoom ?? 110) / 100})`,
                          filter: `brightness(${data.hero.imageBrightness ?? 100}%)`,
                        }}
                      />
                      <div className="pointer-events-none absolute right-[10%] top-[10%] grid size-10 scale-90 place-items-center rounded-full border border-white/15 bg-black/65 text-white opacity-0 shadow-lg backdrop-blur-md transition group-hover:scale-100 group-hover:opacity-100">
                        <Image className="size-4" aria-hidden="true" />
                      </div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(event) => {
                          void replaceHeroImage(event.target.files?.[0]);
                          event.currentTarget.value = "";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-[#252525] bg-[#0e0e0e] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Portrait finishing</h3>
                    <p className="mt-1 text-sm text-[#777]">
                      Drag the portrait above to position it. Use these only for
                      zoom and brightness.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          imageX: 50,
                          imageY: 12,
                          imageZoom: 110,
                          imageBrightness: 100,
                        },
                      })
                    }
                    className="rounded-lg border border-[#303030] px-3 py-2 text-xs text-[#aaa] hover:bg-[#181818]"
                  >
                    Reset adjustments
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <RangeControl
                    label="Zoom"
                    value={data.hero.imageZoom ?? 110}
                    min={100}
                    max={200}
                    onChange={(value) => updateHero("imageZoom", value)}
                  />
                  <RangeControl
                    label="Brightness"
                    value={data.hero.imageBrightness ?? 100}
                    min={50}
                    max={150}
                    onChange={(value) => updateHero("imageBrightness", value)}
                  />
                </div>
              </div>
            </Panel>
          )}
          {section === "videos" && (
            <Panel
              title="Videos"
              description="Manage the video showcase displayed on your homepage."
              action={
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      showcase: {
                        ...data.showcase,
                        videos: [
                          ...data.showcase.videos,
                          { id: Date.now(), title: "New video", video: "" },
                        ],
                      },
                    })
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                >
                  <Plus size={16} />
                  Add video
                </button>
              }
            >
              <div className="mb-10 text-center">
                <InlineEdit
                  ariaLabel="Video showcase small heading"
                  value={data.showcase.eyebrow}
                  onChange={(eyebrow) =>
                    setData({
                      ...data,
                      showcase: { ...data.showcase, eyebrow },
                    })
                  }
                  className="mx-auto max-w-xs text-center text-sm font-semibold uppercase tracking-[.25em] text-cyan-400"
                />
                <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2 text-3xl font-bold md:text-5xl">
                  <InlineEdit
                    ariaLabel="Video showcase title"
                    value={data.showcase.title}
                    onChange={(title) =>
                      setData({
                        ...data,
                        showcase: { ...data.showcase, title },
                      })
                    }
                    className="text-right"
                  />
                  <InlineEdit
                    ariaLabel="Video showcase highlighted title"
                    value={data.showcase.accent}
                    onChange={(accent) =>
                      setData({
                        ...data,
                        showcase: { ...data.showcase, accent },
                      })
                    }
                    className="text-left text-cyan-400"
                  />
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {data.showcase.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#111]">
                      {video.video ? (
                        <video
                          src={video.video}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-[#555]">
                          <Video size={30} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-12">
                        <InlineEdit
                          ariaLabel={`Showcase video ${index + 1} title`}
                          value={video.title}
                          onChange={(title) => updateVideo(index, { title })}
                          className="font-semibold uppercase text-white"
                        />
                      </div>
                      <button
                        aria-label={`Delete ${video.title}`}
                        onClick={() => {
                          requestDelete(
                            `Delete “${video.title}”?`,
                            "This video will be removed from the homepage after you publish the changes.",
                            () => setData({
                              ...data,
                              showcase: {
                                ...data.showcase,
                                videos: data.showcase.videos.filter(
                                  (_, position) => position !== index,
                                ),
                              },
                            }),
                          );
                        }}
                        className="absolute right-3 top-3 rounded-full border border-red-400/20 bg-black/70 p-2 text-red-400 opacity-0 transition group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="p-3">
                      <VideoUpload
                        uploadKey={`showcase-${index}`}
                        activeKey={uploadingVideo}
                        progress={uploadProgress}
                        onCancel={cancelVideoUpload}
                        onSelect={(file) => void uploadVideo(file, `showcase-${index}`, (videoUrl, publicId) =>
                          updateVideo(index, { video: videoUrl, publicId })
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
          {section === "work" && (
            <Panel
              title="Work portfolio"
              description="Manage every niche and video shown on the Work page. Deletions take effect after publishing."
              action={
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      workCategories: [
                        ...data.workCategories,
                        {
                          label: "New niche",
                          key: `niche-${Date.now()}`,
                          videos: [],
                        },
                      ],
                    })
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                >
                  <Plus size={16} />
                  Add niche
                </button>
              }
            >
              <div className="space-y-6">
                {data.workCategories.map((category, categoryIndex) => (
                  <div
                    key={category.key}
                    className="rounded-xl border border-[#252525] bg-[#0e0e0e] p-5"
                  >
                    <div className="flex flex-col gap-4 border-b border-[#242424] pb-5 md:flex-row md:items-end">
                      <div className="grid flex-1 items-end gap-4 sm:grid-cols-[1fr_220px]">
                        <InlineEdit
                          ariaLabel={`Niche ${categoryIndex + 1} name`}
                          value={category.label}
                          onChange={(label) =>
                            updateWorkCategory(categoryIndex, { label })
                          }
                          className="text-2xl font-bold uppercase text-cyan-400"
                        />
                        <Field
                          label="URL key"
                          value={category.key}
                          onChange={(key) =>
                            updateWorkCategory(categoryIndex, {
                              key: key
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "-"),
                            })
                          }
                        />
                      </div>
                      <button
                        onClick={() => {
                          requestDelete(
                            `Delete “${category.label}” niche?`,
                            `This will remove the niche and all ${category.videos.length} videos inside it after you publish the changes.`,
                            () => setData({
                              ...data,
                              workCategories: data.workCategories.filter(
                                (_, index) => index !== categoryIndex,
                              ),
                            }),
                          );
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#3a2020] px-4 py-3 text-sm text-red-400 hover:bg-red-950/30"
                      >
                        <Trash2 size={16} />
                        Delete niche
                      </button>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-sm text-[#888]">
                        {category.videos.length} videos
                      </p>
                      <button
                        onClick={() =>
                          updateWorkCategory(categoryIndex, {
                            videos: [
                              ...category.videos,
                              {
                                id: Date.now(),
                                title: "New video",
                                video: "",
                                frameTime: 2,
                              },
                            ],
                          })
                        }
                        className="flex items-center gap-2 rounded-lg border border-[#303030] px-3 py-2 text-sm hover:bg-[#181818]"
                      >
                        <Plus size={15} />
                        Add video
                      </button>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {category.videos.map((video, videoIndex) => (
                        <div
                          key={video.id}
                          className="group overflow-hidden rounded-2xl border border-white/10 bg-black"
                        >
                          <div className="relative aspect-video overflow-hidden bg-[#111]">
                            {video.video ? (
                              <video
                                src={video.video}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover opacity-80"
                              />
                            ) : (
                              <div className="grid h-full place-items-center text-[#555]">
                                <Video size={28} />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-2 right-10">
                              <InlineEdit
                                ariaLabel={`${category.label} video ${videoIndex + 1} title`}
                                value={video.title}
                                onChange={(title) =>
                                  updateWorkVideo(categoryIndex, videoIndex, {
                                    title,
                                  })
                                }
                                className="text-sm font-semibold text-white"
                              />
                            </div>
                            <button
                              aria-label={`Delete ${video.title}`}
                              onClick={() => {
                                requestDelete(
                                  `Delete “${video.title}”?`,
                                  `This video will be removed from ${category.label} after you publish the changes.`,
                                  () => updateWorkCategory(categoryIndex, {
                                    videos: category.videos.filter(
                                      (_, index) => index !== videoIndex,
                                    ),
                                  }),
                                );
                              }}
                              className="absolute right-2 top-2 rounded-full border border-red-400/20 bg-black/70 p-2 text-red-400 opacity-0 transition group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="space-y-3 p-3">
                            <VideoUpload
                              uploadKey={`work-${categoryIndex}-${videoIndex}`}
                              activeKey={uploadingVideo}
                              progress={uploadProgress}
                              onCancel={cancelVideoUpload}
                              onSelect={(file) => void uploadVideo(file, `work-${categoryIndex}-${videoIndex}`, (videoUrl, publicId) =>
                                updateWorkVideo(categoryIndex, videoIndex, { video: videoUrl, publicId })
                              )}
                            />
                            <Field
                              label="Thumbnail second"
                              type="number"
                              value={String(video.frameTime ?? 2)}
                              onChange={(value) =>
                                updateWorkVideo(categoryIndex, videoIndex, {
                                  frameTime: Number(value),
                                })
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {data.workCategories.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#333] py-16 text-center text-[#777]">
                    No niches yet. Add a niche to rebuild the Work page.
                  </div>
                )}
              </div>
            </Panel>
          )}
          {section === "pricing" && (
            <Panel
              title="Pricing"
              description="Edit your packages, benefits, and featured offer."
              action={
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      pricing: {
                        ...data.pricing,
                        plans: [
                          ...data.pricing.plans,
                          {
                            ...defaultContent.pricing.plans[0],
                            features: [
                              ...defaultContent.pricing.plans[0].features,
                            ],
                            name: "New package",
                          },
                        ],
                      },
                    })
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                >
                  <Plus size={16} />
                  Add package
                </button>
              }
            >
              <div className="mb-10 text-center">
                <InlineEdit
                  ariaLabel="Pricing small heading"
                  value={data.pricing.eyebrow}
                  onChange={(eyebrow) =>
                    setData({ ...data, pricing: { ...data.pricing, eyebrow } })
                  }
                  className="mx-auto max-w-xs text-center text-sm font-semibold uppercase tracking-[.22em] text-cyan-400"
                />
                <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2 text-3xl font-bold md:text-5xl">
                  <InlineEdit
                    ariaLabel="Pricing title"
                    value={data.pricing.title}
                    onChange={(title) =>
                      setData({ ...data, pricing: { ...data.pricing, title } })
                    }
                    className="text-right"
                  />
                  <InlineEdit
                    ariaLabel="Pricing highlighted title"
                    value={data.pricing.accent}
                    onChange={(accent) =>
                      setData({ ...data, pricing: { ...data.pricing, accent } })
                    }
                    className="text-left text-cyan-400"
                  />
                </div>
              </div>
              <div className="grid gap-5 xl:grid-cols-3">
                {data.pricing.plans.map((plan, index) => (
                  <div
                    key={`${plan.name}-${index}`}
                    className={`relative flex min-h-[560px] flex-col rounded-3xl border p-6 ${plan.popular ? "border-blue-400 bg-white/[.05]" : "border-white/10 bg-white/[.025]"}`}
                  >
                    <div className="absolute right-4 top-4 flex gap-2">
                      <label className="cursor-pointer rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs text-[#aaa]">
                        <input
                          type="checkbox"
                          checked={plan.popular}
                          onChange={(event) =>
                            updatePlan(index, { popular: event.target.checked })
                          }
                          className="mr-1.5 accent-blue-500"
                        />
                        Popular
                      </label>
                      <button
                        aria-label={`Delete ${plan.name}`}
                        onClick={() => {
                          requestDelete(
                            `Delete “${plan.name}” package?`,
                            "This pricing package will be removed after you publish the changes.",
                            () => setData({
                              ...data,
                              pricing: {
                                ...data.pricing,
                                plans: data.pricing.plans.filter(
                                  (_, position) => position !== index,
                                ),
                              },
                            }),
                          );
                        }}
                        className="rounded-full border border-red-400/20 bg-black/70 p-2 text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {plan.popular && (
                      <span className="mb-2 w-fit rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold">
                        Popular
                      </span>
                    )}
                    <InlineEdit
                      ariaLabel={`Package ${index + 1} name`}
                      value={plan.name}
                      onChange={(name) => updatePlan(index, { name })}
                      className="mt-7 text-2xl font-semibold"
                    />
                    <InlineEdit
                      ariaLabel={`${plan.name} description`}
                      multiline
                      value={plan.description}
                      onChange={(description) =>
                        updatePlan(index, { description })
                      }
                      className="mt-2 text-sm leading-relaxed text-gray-400"
                    />
                    <div className="my-5 flex items-end gap-1">
                      <InlineEdit
                        ariaLabel={`${plan.name} price`}
                        value={plan.price}
                        onChange={(price) => updatePlan(index, { price })}
                        className="max-w-[150px] text-4xl font-bold"
                      />
                      <InlineEdit
                        ariaLabel={`${plan.name} period`}
                        value={plan.period}
                        onChange={(period) => updatePlan(index, { period })}
                        className="mb-1 max-w-[80px] text-sm text-gray-500"
                      />
                    </div>
                    <ul className="mb-6 flex-1 space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="group flex items-center gap-2"
                        >
                          <Check size={17} className="shrink-0 text-cyan-400" />
                          <InlineEdit
                            ariaLabel={`${plan.name} feature ${featureIndex + 1}`}
                            value={feature}
                            onChange={(value) =>
                              updatePlan(index, {
                                features: plan.features.map((item, position) =>
                                  position === featureIndex ? value : item,
                                ),
                              })
                            }
                            className="text-sm text-gray-300"
                          />
                          <button
                            aria-label="Remove feature"
                            onClick={() =>
                              updatePlan(index, {
                                features: plan.features.filter(
                                  (_, position) => position !== featureIndex,
                                ),
                              })
                            }
                            className="opacity-0 text-red-400 transition group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() =>
                        updatePlan(index, {
                          features: [...plan.features, "New feature"],
                        })
                      }
                      className="mb-4 flex w-fit items-center gap-1.5 text-xs text-[#777] hover:text-white"
                    >
                      <Plus size={13} />
                      Add feature
                    </button>
                    <div
                      className={`rounded-2xl py-3 text-center font-medium ${plan.popular ? "bg-blue-500 text-white" : "border border-white/10 bg-white/[.04]"}`}
                    >
                      <InlineEdit
                        ariaLabel={`${plan.name} button text`}
                        value={plan.buttonText}
                        onChange={(buttonText) =>
                          updatePlan(index, { buttonText })
                        }
                        className="text-center font-semibold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </main>
  );
}
