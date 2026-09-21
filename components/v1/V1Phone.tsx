"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Megaphone, CheckCheck, Signal, Wifi, BatteryFull, Mic } from "lucide-react";

const appear = (delay: number) => ({
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { type: "spring" as const, bounce: 0.2, duration: 0.5, delay },
});

export function V1Phone() {
  const t = useTranslations("v1.hero.phone");

  return (
    <div className="relative mx-auto h-[560px] w-[280px] overflow-hidden rounded-[2.5rem] border-[10px] border-[#0b1020] bg-[#0b1020] shadow-2xl shadow-[rgba(7,11,31,0.3)]">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-2 text-[11px] font-medium text-white">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Signal size={12} />
          <Wifi size={12} />
          <BatteryFull size={12} />
        </div>
      </div>
      <div className="absolute left-1/2 top-0 z-30 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#0b1020]" />

      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-7 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            {t("contactName").charAt(0)}
          </div>
          <div>
            <p className="text-[13px] font-semibold">{t("contactName")}</p>
            <p className="text-[10px] text-white/70">online</p>
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-hidden bg-[#efe7de] px-3 py-3">
          <motion.div {...appear(0.9)} className="mx-auto w-fit rounded-md bg-info-bg px-2.5 py-1 text-[10px] font-medium text-info-text shadow-sm">
            <span className="inline-flex items-center gap-1">
              <Megaphone size={11} strokeWidth={2} />
              {t("adOrigin")}
            </span>
          </motion.div>

          <motion.div {...appear(1.5)} className="flex justify-start">
            <div className="max-w-[78%] rounded-lg rounded-tl-none bg-white px-2.5 py-1.5 text-[12px] text-gray-800 shadow-sm">
              {t("incoming")}
            </div>
          </motion.div>

          <motion.div {...appear(2.3)} className="flex justify-end">
            <div className="max-w-[78%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-2.5 py-1.5 text-[12px] text-gray-900 shadow-sm">
              {t("outgoing")}
            </div>
          </motion.div>

          <motion.div {...appear(3.1)} className="flex justify-start">
            <div className="max-w-[78%] rounded-lg rounded-tl-none bg-white px-2.5 py-1.5 text-[12px] text-gray-800 shadow-sm">
              {t("confirm")}
            </div>
          </motion.div>

          <motion.div {...appear(3.8)} className="mx-auto flex w-fit items-center gap-1.5 rounded-md bg-success-bg px-2.5 py-1 text-[10px] font-semibold text-success-text shadow-sm">
            <CheckCheck size={11} strokeWidth={2.2} />
            {t("aiTag")}
          </motion.div>
        </div>

        <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2">
          <div className="h-8 flex-1 rounded-full bg-white px-3 text-[11px] leading-8 text-gray-400">
            {t("placeholder")}
          </div>
          <Mic size={18} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}
