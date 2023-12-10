document.addEventListener("DOMContentLoaded", function () {
    function displayResult(result) {
        document.getElementById("result").textContent =
            result !== null ? result.toFixed(6) : "Failed to converge";
    }

    function falsePosition(func, a, b, tolerance, maxIterations) {
        let iteration = 0;
        let root;
    
        const iterationsTable = document.getElementById("iterations");
    
        while (iteration < maxIterations) {
            const fa = func(a);
            const fb = func(b);
    
            if (fa === fb) {
                console.error("False Position method failed: division by zero or no convergence.");
                return null;
            }
    
            root = (((a * fb) - (b * fa)) / (fb - fa));
            const froot = func(root);
    
            const newRow = iterationsTable.insertRow(-1);
            newRow.innerHTML = `<td>False Position</td><td>${iteration + 1}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td>${root.toFixed(6)}</td><td>${fa.toFixed(6)}</td><td>${fb.toFixed(6)}</td><td>${froot.toFixed(6)}</td>`;
    
            if (Math.abs(froot) < tolerance) {
                break;
            }
    
            if (froot * fa < 0) {
                b = root;
            } else {
                a = root;
            }
    
            // Check if the root estimate goes outside the interval [a, b]
            if (root < a || root > b) {
                console.error("False Position method failed: root estimate outside the interval [a, b].");
                return null;
            }
    
            iteration++;
        }
    
        return iteration < maxIterations ? root : null;
    }
    

    function bisection(func, a, b, tolerance, maxIterations) {
        let iteration = 0;
        let root;

        const iterationsTable = document.getElementById("iterations");

        while (iteration < maxIterations) {
            const fa = func(a);
            const fb = func(b);

            if (fa * fb > 0) {
                console.error("Bisection method failed: endpoints have the same sign or no convergence.");
                return null;
            }

            root = a + (b - a) / 2;
            const froot = func(root);

            const newRow = iterationsTable.insertRow(-1);
            newRow.innerHTML = `<td>Bisection</td><td>${iteration + 1}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td>${root.toFixed(6)}</td><td>${fa.toFixed(6)}</td><td>${fb.toFixed(6)}</td><td>${froot.toFixed(6)}</td>`;

            if (Math.abs(froot) < tolerance) {
                break;
            }

            if (froot * fa < 0) {
                b = root;
            } else {
                a = root;
            }

            iteration++;
        }

        return iteration < maxIterations ? root : null;
    }

    function newtonRaphson(func, initialGuess, tolerance, maxIterations) {
        let iteration = 0;
        let root = initialGuess;

        const iterationsTable = document.getElementById("iterations");

        while (iteration < maxIterations) {
            const fa = func(root);
            const fprimea = derivative(func, root);

            if (fprimea === 0) {
                console.error("Newton-Raphson method failed: derivative is zero or no convergence.");
                return null;
            }

            root = root - fa / fprimea;
            const froot = func(root);

            const newRow = iterationsTable.insertRow(-1);
            newRow.innerHTML = `<td>Newton-Raphson</td><td>${iteration + 1}</td><td></td><td></td><td>${root.toFixed(6)}</td><td>${fa.toFixed(6)}</td><td></td><td>${froot.toFixed(6)}</td>`;

            if (Math.abs(froot) < tolerance) {
                break;
            }

            iteration++;
        }

        return iteration < maxIterations ? root : null;
    }

    function secant(func, a, b, tolerance, maxIterations) {
        let iteration = 0;
        let root;

        const iterationsTable = document.getElementById("iterations");

        while (iteration < maxIterations) {
            const fa = func(a);
            const fb = func(b);

            if (fa === fb) {
                console.error("Secant method failed: division by zero or no convergence.");
                return null;
            }

            root = b - (fb * (b - a)) / (fb - fa);
            const froot = func(root);

            const newRow = iterationsTable.insertRow(-1);
            newRow.innerHTML = `<td>Secant</td><td>${iteration + 1}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td>${root.toFixed(6)}</td><td>${fa.toFixed(6)}</td><td>${fb.toFixed(6)}</td><td>${froot.toFixed(6)}</td>`;

            if (Math.abs(froot) < tolerance) {
                break;
            }

            a = b;
            b = root;
            iteration++;
        }

        return iteration < maxIterations ? root : null;
    }

    function derivative(func, x, epsilon = 1e-6) {
        return (func(x + epsilon) - func(x - epsilon)) / (2 * epsilon);
    }

    function findRoot(method) {
        const a = parseFloat(document.getElementById("a").value);
        const b = parseFloat(document.getElementById("b").value);
        const initialGuess = parseFloat(document.getElementById("initialGuess").value);
        const tolerance = parseFloat(document.getElementById("tolerance").value);
        const equation = document.getElementById("equation").value;

        const iterationsTable = document.getElementById("iterations");
        iterationsTable.innerHTML = "<tr><th>Method</th><th>Iteration</th><th>a</th><th>b</th><th>Root</th><th>f(a)</th><th>f(b)</th><th>f(root)</th></tr>";

        document.getElementById("equationOutput").textContent = `The given Equation is: ${equation}`;

        try {
            // Create a function from the input equation
            const func = new Function('x', `return ${equation};`);
            const maxIterations = 20; // Increase maxIterations for better convergence

            let result;
            switch (method) {
                case "falsePosition":
                    result = falsePosition(func, a, b, tolerance, maxIterations);
                    break;
                case "bisection":
                    result = bisection(func, a, b, tolerance, maxIterations);
                    break;
                case "newtonRaphson":
                    result = newtonRaphson(func, initialGuess, tolerance, maxIterations);
                    break;
                case "secant":
                    result = secant(func, a, b, tolerance, maxIterations);
                    break;
                default:
                    console.error("Invalid method");
                    break;
            }

            // Display the result
            displayResult(result);
        } catch (error) {
            console.error("Error parsing equation:", error);
            displayResult(null);
        }
    }

    // Add event listeners to the buttons
    document.getElementById("falsePositionBtn").addEventListener("click", function () {
        findRoot("falsePosition");
    });
    document.getElementById("bisectionBtn").addEventListener("click", function () {
        findRoot("bisection");
    });
    document.getElementById("newtonRaphsonBtn").addEventListener("click", function () {
        findRoot("newtonRaphson");
    });
    document.getElementById("secantBtn").addEventListener("click", function () {
        findRoot("secant");
    });
});
