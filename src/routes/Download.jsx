import { Outlet, useLocation } from "react-router-dom";
import "../css/download.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Download = () => {
    const { pathname } = useLocation();

    const subPath = pathname.split("/").filter(Boolean).at(-1);

    const formattedSubPath = subPath && subPath !== "download" ? subPath.charAt(0).toUpperCase() + subPath.slice(1) : "";

    return (
        <main className="download-main">
            <Header path="Download" subPath={formattedSubPath} />
            <section className="download-content">
                <Outlet />
            </section>
            <Footer />
        </main>
    );
};

export default Download;