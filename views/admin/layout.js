const layout = ({ template }) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
            <meta name="akos"/>
            </head>

            <body>
            ${template}
            </body>
        </html>

    `
}


export default layout;