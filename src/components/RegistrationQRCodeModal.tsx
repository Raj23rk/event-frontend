import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  X,
  Copy,
  Check,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ExternalLink,
  Wifi,
  Sparkles,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface RegistrationQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredCount?: number;
}

export const RegistrationQRCodeModal: React.FC<RegistrationQRCodeModalProps> = ({
  isOpen,
  onClose,
  registeredCount = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [customHost, setCustomHost] = useState('');
  const [useCustomHost, setUseCustomHost] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Default registration URL based on current origin
  const defaultOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const effectiveUrl = useCustomHost && customHost.trim()
    ? (customHost.startsWith('http') ? customHost : `http://${customHost}`)
    : `${defaultOrigin}/register`;

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isProjectorMode) {
          setIsProjectorMode(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProjectorMode, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(effectiveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback copy
      const input = document.createElement('input');
      input.value = effectiveUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    // Create a beautifully framed badge canvas for download
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    exportCanvas.width = 600;
    exportCanvas.height = 760;

    // Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, 600, 760);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 140);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 140);

    // Text: Brand
    ctx.fillStyle = '#f97316'; // orange-500
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WEGROW SKILL CAMPUS & B SCHOOL', 300, 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Student Registration • 31 Oct 2026', 300, 78);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Scan with mobile camera to open Registration Form', 300, 105);

    // QR container box
    ctx.fillStyle = '#ffffff';
    ctx.roundRect ? ctx.roundRect(100, 150, 400, 400, 24) : ctx.fillRect(100, 150, 400, 400);
    ctx.fill();

    // Draw QR canvas inside
    ctx.drawImage(canvas, 130, 180, 340, 340);

    // Footer info
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(effectiveUrl, 300, 590);

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Career Guidance & HTML/CSS Skill Evaluation Workshop', 300, 630);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Sivakasi Campus • 30 Quota Batch', 300, 660);

    const link = document.createElement('a');
    link.download = 'WeGrow_Student_Registration_QR_31Oct2026.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  // Fullscreen Projector Mode (Ideal for classroom projector screen)
  if (isProjectorMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        {/* Projector Top Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <img
              src="/wegrow-logo.png"
              alt="WeGrow"
              className="h-12 sm:h-14 bg-white p-1.5 rounded-xl object-contain shadow-md"
            />
            <div>
              <span className="text-orange-400 font-extrabold uppercase tracking-widest text-xs block">
                WeGrow Skill Campus & B School, Sivakasi
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Career Guidance Workshop • Student Self-Registration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Batch Quota</span>
              <span className="text-lg font-mono font-bold text-orange-400">
                {registeredCount} / 30 Registered
              </span>
            </div>
            <button
              onClick={() => setIsProjectorMode(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Projector Mode</span>
            </button>
          </div>
        </div>

        {/* Projector Center QR */}
        <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/40 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Smartphone className="w-4 h-4" />
            <span>Scan with your phone camera to fill the Student Details Form</span>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl ring-8 ring-blue-500/20 mb-6">
            <QRCodeSVG
              value={effectiveUrl}
              size={320}
              level="H"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <div className="text-xl font-mono font-black text-white bg-slate-900/90 border border-slate-800 px-6 py-2.5 rounded-2xl inline-block shadow-inner">
              {effectiveUrl}
            </div>
            <p className="text-xs text-slate-400">
              Students will receive their official Registration ID (e.g., <strong className="text-orange-400">WG-2026-001</strong>) immediately upon submission.
            </p>
          </div>
        </div>

        {/* Projector Footer */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
          <span>Date: 31 October 2026 • Opp. Ayyappan Kovil, Police Station Rd, Sivakasi</span>
          <span>Press ESC or click Exit to return to Admin Dashboard</span>
        </div>
      </div>
    );
  }

  // Standard Modal View
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-orange-400">
                  WeGrow Quick Access
                </span>
                <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  Student Form
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Student Registration QR Code
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Scan this QR code with any mobile phone camera or scanner to instantly open the{' '}
              <strong className="text-blue-950 font-bold">Student Details Registration Form</strong> (Image 2).
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div className="bg-slate-50 p-5 rounded-3xl border-2 border-dashed border-slate-200 shadow-inner relative group">
              <QRCodeSVG
                value={effectiveUrl}
                size={220}
                level="H"
                marginSize={2}
                bgColor="#f8fafc"
                fgColor="#0f172a"
              />
              {/* Mascot Center watermark badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-orange-500 flex items-center justify-center p-0.5">
                  <img src="/wegrow-mascot.webp" alt="WeGrow" className="w-7 h-7 object-contain" />
                </div>
              </div>
            </div>

            {/* Hidden canvas for high-resolution image generation */}
            <div ref={canvasRef} className="hidden">
              <QRCodeCanvas
                value={effectiveUrl}
                size={340}
                level="H"
                marginSize={1}
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Smartphone className="w-3.5 h-3.5 text-orange-500" />
              <span>Camera auto-detects link • No special app required</span>
            </div>
          </div>

          {/* URL Box with Copy */}
          <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200 mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1.5">
              <span>Target Registration URL:</span>
              <a
                href={effectiveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={effectiveUrl}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* LAN IP / Network Host Switcher Helper (Crucial for testing on phone via WiFi) */}
          <div className="mb-5 bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-blue-700" />
                <span>Scanning from a Phone on same Wi-Fi?</span>
              </span>
              <button
                type="button"
                onClick={() => setUseCustomHost(!useCustomHost)}
                className="text-[11px] text-blue-700 font-bold underline hover:text-blue-900"
              >
                {useCustomHost ? 'Reset to localhost' : 'Set Network IP'}
              </button>
            </div>
            {useCustomHost ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] text-blue-800">
                  Phones cannot access <code className="bg-blue-100 px-1 py-0.5 rounded">localhost</code>. Enter your PC's Wi-Fi IP address (e.g. <code>192.168.1.50:3000</code>):
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.15:3000"
                    value={customHost}
                    onChange={(e) => setCustomHost(e.target.value)}
                    className="flex-1 bg-white border border-blue-300 rounded-xl px-2.5 py-1 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={() => {
                      if (!customHost.trim()) setUseCustomHost(false);
                    }}
                    className="px-2.5 py-1 bg-blue-900 text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-blue-700 leading-snug">
                If testing with mobile phones over local Wi-Fi, click <strong className="cursor-pointer underline" onClick={() => setUseCustomHost(true)}>Set Network IP</strong> to enter your computer's local IP address.
              </p>
            )}
          </div>

          {/* Action Buttons Toolbar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setIsProjectorMode(true)}
              className="p-2.5 bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-950 hover:to-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex flex-col items-center justify-center gap-1 group"
              title="Full screen view for classroom projector"
            >
              <Maximize2 className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Projector</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex flex-col items-center justify-center gap-1 group"
              title="Download high-resolution PNG image"
            >
              <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition flex flex-col items-center justify-center gap-1 group"
              title="Print flyer for student desks"
            >
              <Printer className="w-4 h-4 text-blue-900 group-hover:scale-110 transition-transform" />
              <span>Print Flyer</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>WeGrow Skill Campus • 31 Oct 2026</span>
          </span>
          <span className="font-mono font-bold text-blue-950">
            {registeredCount}/30 Enrolled
          </span>
        </div>
      </div>
    </div>
  );
};

