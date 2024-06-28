'use client';

import { useEffect } from 'react';
import Head from 'next/head';

const TableauEmbed = () => {
    useEffect(() => {
        const initViz = async () => {
            const containerDiv = document.getElementById("vizContainer");
            const url = "YOUR_TABLEAU_DASHBOARD_URL";

            const response = await fetch('/api/getToken');
            const data = await response.json();

            const options = {
                device: "desktop",
                authType: window.tableau.authType.EmbeddedToken,
                embeddedToken: data.token
            };

            new window.tableau.Viz(containerDiv, url, options);
        };

        initViz();
    }, []);

    return (
        <div>
            <Head>
                <script src="https://public.tableau.com/javascripts/api/tableau-2.8.0.min.js"></script>
            </Head>
            <div id="vizContainer" style={{ width: '100%', height: '800px' }}></div>
        </div>
    );
};

export default TableauEmbed;
