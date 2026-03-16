document.getElementById("generate-btn").addEventListener("click", async () => {
    const fileInput = document.getElementById("image-upload");
    const bizName = document.getElementById("biz-name").value;
    const industry = document.getElementById("industry").value;

    // Check if the user actually typed a name and uploaded a file
    if (!fileInput.files[0] || !bizName) {
        alert("Please enter a business name and upload an image!");
        return;
    }

    // UI Setup: Show loading state, hide any previous results
    const loadingText = document.getElementById("loading-text");
    loadingText.innerText = "⏳ Preparing your image...";
    loadingText.style.display = "block";
    document.getElementById("mockup-result").style.display = "none";

    // 1. Prepare data for Remove.bg API
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    // 👇 ADD YOUR REMOVE.BG API KEY HERE 👇
    // Get yours from: https://www.remove.bg/api
    const apiKey = "aMjaN6B37Xu32zDpxuAvfRz9";

    if (!apiKey || apiKey === "YOUR_REMOVE_BG_API_KEY") {
        alert("Please add your Remove.bg API Key in generator.js line 21!");
        loadingText.style.display = "none";
        return;
    }

    try {
        loadingText.innerText = "☁️ Uploading to AI servers...";

        // 2. Upload to Remove.bg via their API
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": apiKey
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        loadingText.innerText = "✨ Removing background and rendering...";

        // 3. Get the Blob representation of the new image and create an Object URL
        const blob = await response.blob();
        const transformedUrl = URL.createObjectURL(blob);

        loadingText.innerText = "🎨 Applying finishing touches...";

        // 4. Update Website to Display the Mockup
        document.getElementById("mockup-title").innerText = bizName;
        document.getElementById("mockup-logo").innerText = bizName;
        document.getElementById("mockup-image").src = transformedUrl;

        // Change CSS Class based on industry to instantly change colors/fonts
        const heroLayout = document.getElementById("hero-layout");
        heroLayout.className = `hero-layout theme-${industry}`;

        // Hide loading text, show the beautiful result!
        loadingText.style.display = "none";
        document.getElementById("mockup-result").style.display = "block";
    } catch (error) {
        console.error("Error uploading to Remove.bg:", error);
        alert(
            "Something went wrong. Make sure you placed your valid Remove.bg API key. Error: " +
            error.message,
        );
        document.getElementById("loading-text").style.display = "none";
    }
});
