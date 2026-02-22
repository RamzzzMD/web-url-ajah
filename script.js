const themeToggleBtn = document.getElementById('themeToggle');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const html = document.documentElement;
        const body = document.body;

        const loadingOverlay = document.getElementById('loadingOverlay');
        const errorNotification = document.getElementById('errorNotification');
        const errorMessage = document.getElementById('errorMessage');
        const closeErrorBtn = document.getElementById('closeErrorBtn');
        const shortenForm = document.getElementById('shortenForm');
        const submitBtn = document.getElementById('submitBtn');
        const urlInput = document.getElementById('urlInput');
        const urlHelpText = document.getElementById('urlHelpText');
        const spaceWarning = document.getElementById('spaceWarning');

        let timeoutId = null;

        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'dark') {
                enableDarkMode();
            } else {
                enableLightMode();
            }
        }

        function toggleTheme() {
            if (html.classList.contains('dark')) {
                enableLightMode();
                localStorage.setItem('theme', 'light');
            } else {
                enableDarkMode();
                localStorage.setItem('theme', 'dark');
            }
        }

        function enableLightMode() {
            html.classList.remove('dark');
            body.classList.add('light-mode');
            body.classList.remove('bg-black', 'text-white');
            body.classList.add('bg-whitish', 'text-blackish');
            
            document.querySelectorAll('.border-white').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-white');
                element.classList.add('border-blackish');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-white');
                mainCard.classList.add('border-blackish');
            }
            
            themeToggleBtn.classList.remove('bg-black', 'border-white');
            themeToggleBtn.classList.add('bg-white', 'border-blackish');
            
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleLightIcon.classList.remove('text-white');
            themeToggleLightIcon.classList.add('text-black');
        }

        function enableDarkMode() {
            html.classList.add('dark');
            body.classList.remove('light-mode');
            body.classList.remove('bg-whitish', 'text-blackish');
            body.classList.add('bg-black', 'text-white');
            
            document.querySelectorAll('.border-blackish').forEach(element => {
                element.classList.remove('border-blackish');
                element.classList.add('border-white');
            });
            
            const mainCard = document.querySelector('.w-full.max-w-md');
            if (mainCard) {
                mainCard.classList.remove('border-blackish');
                mainCard.classList.add('border-white');
            }
            
            themeToggleBtn.classList.remove('bg-white', 'border-blackish');
            themeToggleBtn.classList.add('bg-black', 'border-white');
            
            themeToggleLightIcon.classList.add('hidden');
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.remove('text-black');
            themeToggleDarkIcon.classList.add('text-white');
        }

        function hasLeadingSpace(str) {
            return str.length > 0 && str[0] === ' ';
        }

        function preventLeadingSpace(event) {
            if (event.key === ' ' && event.target.selectionStart === 0) {
                event.preventDefault();
                showSpaceWarning();
            }
        }

        function handlePaste(event) {
            setTimeout(() => {
                const value = urlInput.value;
                if (hasLeadingSpace(value)) {
                    const trimmedValue = value.trimStart();
                    urlInput.value = trimmedValue;
                    showSpaceWarning('Spaces at the beginning have been removed');
                }
                validateInput();
            }, 0);
        }

        function showSpaceWarning(message = 'URL cannot start with spaces') {
            spaceWarning.textContent = '⚠️ ' + message;
            spaceWarning.classList.remove('hidden');
            urlInput.classList.add('space-error');
        }

        function hideSpaceWarning() {
            spaceWarning.classList.add('hidden');
            urlInput.classList.remove('space-error');
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorNotification.classList.remove('hidden');
            errorNotification.classList.add('fade-in');
            
            urlInput.style.borderColor = '#dc2626';
            urlHelpText.style.color = '#dc2626';
            urlHelpText.textContent = '❌ ' + message;
        }

        function hideError() {
            errorNotification.classList.add('hidden');
            urlInput.style.borderColor = '';
            urlHelpText.style.color = '';
            urlHelpText.textContent = 'Example: https://github.com/username/repository';
        }

        function validateInput() {
            const url = urlInput.value;
            
            if (url.length > 0) {
                if (hasLeadingSpace(url)) {
                    urlInput.setCustomValidity('URL cannot start with space');
                    urlInput.style.borderColor = '#f59e0b';
                    urlHelpText.style.color = '#f59e0b';
                    urlHelpText.textContent = '⚠️ URL cannot start with spaces';
                    spaceWarning.classList.remove('hidden');
                    return false;
                }
                
                hideSpaceWarning();
                
                try {
                    new URL(url);
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                        urlInput.setCustomValidity('');
                        urlInput.style.borderColor = '#10b981';
                        urlHelpText.style.color = '#10b981';
                        urlHelpText.textContent = '✅ Valid URL';
                        return true;
                    } else {
                        throw new Error('Invalid protocol');
                    }
                } catch (err) {
                    urlInput.setCustomValidity('Invalid URL');
                    urlInput.style.borderColor = '#dc2626';
                    urlHelpText.style.color = '#dc2626';
                    urlHelpText.textContent = '❌ Invalid URL format';
                    return false;
                }
            } else {
                urlInput.setCustomValidity('');
                urlInput.style.borderColor = '';
                urlHelpText.style.color = '';
                urlHelpText.textContent = 'Example: https://github.com/username/repository';
                hideSpaceWarning();
                return false;
            }
        }

        function showLoading() {
            loadingOverlay.classList.add('active');
            submitBtn.disabled = true;
            
            // Set timeout untuk menghilangkan loading jika terlalu lama
            timeoutId = setTimeout(function() {
                hideLoading();
                showError('Request timed out. Please try again.');
            }, 10000);
        }

        function hideLoading() {
            loadingOverlay.classList.remove('active');
            submitBtn.disabled = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        }

        closeErrorBtn.addEventListener('click', function() {
            hideError();
        });

        shortenForm.addEventListener('submit', function(e) {
            const url = urlInput.value;
            
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            if (hasLeadingSpace(url)) {
                e.preventDefault();
                showError('URL cannot start with spaces. Please remove leading spaces.');
                return;
            }
            
            if (!url) {
                e.preventDefault();
                showError('URL cannot be empty');
                return;
            }
            
            try {
                new URL(url);
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    throw new Error('URL must start with http:// or https://');
                }
            } catch (err) {
                e.preventDefault();
                showError('Invalid URL format. Please enter a valid URL (e.g., https://example.com)');
                return;
            }
            
            hideError();
            showLoading();
        });

        urlInput.addEventListener('input', function() {
            validateInput();
        });

        urlInput.addEventListener('focus', function() {
            hideError();
        });

        urlInput.addEventListener('blur', function() {
            const url = this.value;
            if (hasLeadingSpace(url)) {
                showSpaceWarning();
            }
        });

        urlInput.addEventListener('keydown', preventLeadingSpace);
        urlInput.addEventListener('paste', handlePaste);

        window.addEventListener('pageshow', function(event) {
            hideLoading();
            hideError();
            hideSpaceWarning();
        });

        // Inisialisasi
        initTheme();
        
        themeToggleBtn.addEventListener('click', toggleTheme);
