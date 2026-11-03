import { useState } from "react";
import { Link, NavLink } from "react-router";

import Button from "@/components/common/Button";
import Container from "@/components/layout/Container";
import { ROUTES } from "@/constants/routes";
import { BUTTON_SIZE, BUTTON_VARIANT } from "@/constants/ui";
import { cn } from "@/utils/cn";

// নেভিগেশন লিংক ডেটা হিসেবে রাখলাম: নতুন লিংক যোগ করতে এক লাইন
const NAV_ITEMS = [{ label: "Tasks", to: ROUTES.TASKS }];

// NavLink-এর className একটা function নিতে পারে: { isActive } পায় (বর্তমান URL মিললে true)
// সক্রিয় লিংক হালকা brand পটভূমিতে, বাকিগুলো ধূসর আর hover-এ আভা
const getNavLinkClass = ({ isActive }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-content-muted hover:bg-surface-muted hover:text-content",
  );

// আইকন: ছোট SVG। aria-hidden: স্ক্রিন-রিডার উপেক্ষা করবে (বর্ণনা আসবে বাটনের aria-label থেকে)
function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-6"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-6"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function Header() {
  // মোবাইল মেনু খোলা না বন্ধ: এটাই component-এর state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // সাময়িক: M3-তে সত্যিকারের logout আসবে
  const handleLogout = () => {
    console.log("Logout (পরে বানাব)");
  };

  return (
    // sticky top-0: স্ক্রল করলেও উপরে আটকে থাকে। z-40: অন্য কনটেন্টের ওপরে (Modal পরে z-50 হবে)
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container className="flex h-16 items-center justify-between">
        <Link
          to={ROUTES.TASKS}
          onClick={closeMenu}
          className="rounded-lg text-lg font-bold text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Todo App
        </Link>

        {/* ডেস্কটপ নেভ: "hidden" মানে ছোট স্ক্রিনে লুকানো; md: (৭৬৮px+) থেকে flex হয়ে দেখা যায় */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={getNavLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ডেস্কটপে ব্যবহারকারীর নাম ও Logout (নামটা M2-এর পর Redux থেকে আসবে) */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm text-content-muted">Abdur Rahim</span>
          <Button
            size={BUTTON_SIZE.SM}
            variant={BUTTON_VARIANT.SECONDARY}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* হ্যামবার্গার: md:hidden মানে ডেস্কটপে লুকানো।
            আমাদের একমাত্র Button ব্যবহার করলাম। size-11 = ৪৪×৪৪px; px-0 ডিফল্ট px-4-কে সরায় (cn-এর কাজ) */}
        <Button
          variant={BUTTON_VARIANT.GHOST}
          className="size-11 px-0 md:hidden"
          // বাটনে লেখা নেই, তাই aria-label দিয়ে নাম দিতে হয়
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          // aria-expanded: মেনু খোলা কিনা স্ক্রিন-রিডারকে জানায়; aria-controls: কোন element নিয়ন্ত্রণ করছে
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          // আগের মানের ওপর নির্ভর করছি, তাই updater function (1.2)
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </Button>
      </Container>

      {/* মোবাইল মেনু: state true হলেই DOM-এ আসে (conditional rendering) */}
      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-line md:hidden">
          <Container className="space-y-3 py-3">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  // লিংকে ক্লিক করলে মেনু বন্ধ হয়ে যাবে
                  onClick={closeMenu}
                  className={getNavLinkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm text-content-muted">Abdur Rahim</span>
              <Button variant={BUTTON_VARIANT.SECONDARY} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

export default Header;