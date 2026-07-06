import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import '../css/contribute.css'

const Contribute = () => {

    const [copied, setCopied] = useState(false)

    const pixKey = '00020126580014br.gov.bcb.pix013662634705-bd28-4c02-83d0-538823828c845204000053039865802BR5923Leonardo da Silva Pinto6002NA62070503***6304EC92'

    const copyPix = async () => {
        await navigator.clipboard.writeText(pixKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    return (
        <main className='contribute-main'>
            <Header path={'Contribute'} />
            <section className='contribute-content'>
                <h1>Contribution to GitCV</h1>
                <p>GitCV is an independent project built with a strong focus on performance, usability, and professional presentation. Financial support helps ensure continuous development, new features, and the long-term sustainability of the platform.</p>

                <h2>Why contribute?</h2>
                <hr />
                <p>Unlike traditional resume platforms, GitCV does not rely on intrusive advertising or the exploitation of user data. Instead, it is built around transparency and a developer-first approach, transforming GitHub profiles into professional resumes and enabling meaningful profile comparisons. Community support plays a key role in maintaining the platform’s quality, reliability, and continuous innovation.</p>

                <h2>How are the resources used?</h2>
                <hr />
                <section className='contribute-cards'>
                    <article className='contribute-card'>
                        <h3>Infrastructure</h3>
                        <p>Costs of servers, storage, CDN, and services needed to keep the platform available and fast.</p>
                    </article>

                    <article className='contribute-card'>
                        <h3>Development</h3>
                        <p>Implementation of new features, refactoring, optimizations, and bug fixes.</p>
                    </article>

                    <article className='contribute-card'>
                        <h3>Maintenance</h3>
                        <p>Monitoring, security, technical updates, and continuous improvements to the system's foundation.</p>
                    </article>
                </section>

                <h2>Contribute via PIX</h2>
                <hr />

                <section className='contribute-via-pix'>
                    <img src="https://methodpac.github.io/DB/img/PIX-QrCode.png" />

                    <section className='contribute-pix-content'>
                        <p>PIX key</p>
                        <code>{pixKey}</code>
                        <button onClick={copyPix}>{copied ? ('Copied!') : 'Copy PIX key'}</button>

                        <p>After payment, there is no need to send proof of payment. Your contribution is already part of the ongoing support for the project.</p>
                        <div>
                            <span>Account holder</span>
                            <p>Leonardo Silva - BTG Bank</p>
                        </div>
                    </section>
                </section>

                <hr />

                <section className="contribute-footer">
                    <p>Thank you for your interest in supporting GitCV. Every contribution is used responsibly and with a focus on the project's progress.</p>
                </section>

            </section>
            <Footer />
        </main>
    )
}

export default Contribute
