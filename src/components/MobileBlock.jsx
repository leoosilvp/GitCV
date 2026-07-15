import { Laptop } from "@carbon/icons-react";
import icon from '../assets/svg/icon.svg'

export function MobileBlock() {
    return (
        <main className="mobile-block">
            <article className="mobile-block-card">
                <div>
                    <img src={icon} />
                    <div className="hr" />
                    <Laptop size={55} />
                </div>
                <h1>Desktop only</h1>
                <p>GitCV was designed for a desktop experience. Please access the application from a computer for the best experience.</p>
            </article>
        </main>
    );
}