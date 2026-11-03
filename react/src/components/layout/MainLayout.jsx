import { Outlet } from "react-router"

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";

function MainLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 py-6">
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout;