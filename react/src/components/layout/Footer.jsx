import Container from "@/components/layout/Container";

function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-4 text-center text-sm text-content-muted">
        {/* new Date().getFullYear(): বর্তমান বছর, তাই প্রতি বছর হাতে বদলাতে হয় না */}© {new Date().getFullYear()} Todo App
      </Container>
    </footer>
  );
}

export default Footer;