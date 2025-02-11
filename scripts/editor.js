document.addEventListener("DOMContentLoaded", () => {
    const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        mode: "htmlmixed",
        theme: "dracula",
        lineNumbers: true,
        tabSize: 4
    });

    document.getElementById("language").addEventListener("change", () => {
        const selectedLanguage = document.getElementById("language").value;
        editor.setOption("mode", selectedLanguage);
    });

    let pyodideReady = false;
    let pyodideInstance = null;

    async function loadPyodideOnce() {
        if (!pyodideReady) {
            pyodideInstance = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
            pyodideReady = true;
        }
    }

    window.runCode = async function () {
        const code = editor.getValue();
        const language = document.getElementById("language").value;
        const outputFrame = document.getElementById("output");

        if (language === "htmlmixed" || language === "javascript") {
            outputFrame.srcdoc = `<script>${sanitize(code)}</script>`;
        } else if (language === "python") {
            try {
                await loadPyodideOnce();
                let output = await pyodideInstance.runPythonAsync(code);
                outputFrame.srcdoc = `<pre>${output}</pre>`;
            } catch (error) {
                outputFrame.srcdoc = `<pre style="color: red;">Ошибка: ${error}</pre>`;
            }
        }
    };

    function sanitize(input) {
        return input.replace(/<script>/g, "").replace(/<\/script>/g, "");
    }

    fetch("nav/navbar.html")
        .then(response => response.text())
        .then(data => document.getElementById("navbar-container").innerHTML = data)
        .catch(error => console.error("Ошибка загрузки navbar:", error));
});
