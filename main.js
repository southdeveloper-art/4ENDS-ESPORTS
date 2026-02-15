// Basic interactions for 4nds Esports website

document.addEventListener('DOMContentLoaded', () => {
    // Universal Navigation Handler (No URL Preview)
    document.querySelectorAll('[data-href]').forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const destination = link.getAttribute('data-href');

            if (destination.startsWith('#')) {
                // Handle anchor links
                const target = document.querySelector(destination);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Update active link
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            } else {
                // Navigate to page
                window.location.href = destination;
            }
        });
    });

    // Legacy smooth scrolling for old href links (if any remain)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update active link
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Navbar transparency on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(10, 11, 16, 0.95)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.background = 'rgba(10, 11, 16, 0.8)';
        }
    });

    // Add hover sound/effect logic here if needed
    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });

    // Add scroll animations for sections
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    const users = JSON.parse(localStorage.getItem('4ends_users')) || {};
    // const users = {}; // Reset to empty, removed hardcoded data.
    let currentUser = JSON.parse(localStorage.getItem('4ends_current_user')) || null;
    let adminEditingEmail = null; // Declare missing variable

    // --- Access Control ---
    // If on Tournaments page and not logged in, redirect to Profile (Login)
    if (window.location.pathname.includes('tournaments') && !currentUser) {
        window.location.href = '../profile/';
    }

    // Admin Access Configuration
    const ADMIN_EMAILS = ['admin@4ends.com', 'southdeveloperr@gmail.com']; // User to provide more gmails

    const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1472097991811792917/SyiA_rYwRzta_qOA3A4UauIZSgnTag_5rcj7dARI-3IUU5FJsVw0eIW74MUD6yngMYh2";

    // --- Centralized Game Data ---
    const LIVE_TOURNAMENTS = [
        "TELUGU ELITE SERIES S5"
    ];

    const sendDiscordLog = async (event, user) => {
        saveLocalLog(event, user);
        try {
            await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: `User ${event}`,
                        color: event === 'Login' ? 65280 : 16711680, // Green for login, Red for logout
                        fields: [
                            { name: 'Username', value: user.username || 'Unknown', inline: true },
                            { name: 'Email', value: user.email || 'Unknown', inline: true },
                            { name: 'Time', value: new Date().toLocaleString(), inline: false }
                        ],
                        footer: { text: '4ENDS ESPORTS Bot' }
                    }]
                })
            });
        } catch (err) {
            console.error('Webhook failed:', err);
        }
    };

    // --- Multi-Page Logic Detectors (More robust version) ---
    const isProfilePage = window.location.pathname.includes('/profile/') || document.getElementById('profile-dashboard');
    const isTournamentsPage = window.location.pathname.includes('/tournaments/') || document.querySelector('.tournaments-grid');
    const isAboutPage = window.location.pathname.includes('/about/') || document.querySelector('.about-hero');
    const isHomePage = document.getElementById('how-it-works') !== null;

    const navAvatar = document.getElementById('nav-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    const authContainer = document.getElementById('auth-container');
    const profileDashboard = document.getElementById('profile-dashboard');

    // --- Global Role Selection Elements ---
    const roleToggle = document.getElementById('role-toggle');
    const roleBtns = document.querySelectorAll('.role-btn');
    const playerSteps = document.getElementById('player-steps');
    const organizerSteps = document.getElementById('organizer-steps');
    const roleChoiceArea = document.getElementById('role-choice-area');
    const roleChoiceBtns = document.querySelectorAll('.role-choice-btn');

    // Define function first to avoid ReferenceError
    window.switchRoleView = (role) => {
        console.log('Switching Role View to:', role);
        if (!roleToggle || !playerSteps || !organizerSteps) return;

        if (role === 'player') {
            roleToggle.classList.remove('organizer-active');
            roleBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-role') === 'player'));
            playerSteps.classList.add('active');
            playerSteps.classList.remove('hidden');
            organizerSteps.classList.remove('active');
            organizerSteps.classList.add('hidden');
        } else {
            roleToggle.classList.add('organizer-active');
            roleBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-role') === 'organizer'));
            organizerSteps.classList.add('active');
            organizerSteps.classList.remove('hidden');
            playerSteps.classList.remove('active');
            playerSteps.classList.add('hidden');
        }
    };

    console.log('--- 4ENDS ESORTS Booting ---');
    console.log('Page Context:', { isHomePage, isTournamentsPage, isProfilePage, isAboutPage });
    console.log('User State:', currentUser ? currentUser.username : 'Guest');
    console.log('--- ---');

    const updateUIState = () => {
        // Shared Navbar Updates
        const navActions = document.querySelector('.nav-actions');
        const loginBtn = document.getElementById('login-btn');
        const connectBtn = document.getElementById('connect-btn');
        const userInfo = document.getElementById('user-info');
        const navCtaButtons = document.getElementById('nav-cta-buttons');

        const guestCta = document.getElementById('guest-cta');
        const loggedInCta = document.getElementById('logged-in-cta');

        if (currentUser) {
            // Logged In
            if (loginBtn) loginBtn.classList.add('hidden');
            if (connectBtn) connectBtn.classList.add('hidden');
            if (userInfo) userInfo.classList.remove('hidden');

            // Hero CTA toggling
            if (guestCta) guestCta.classList.add('hidden');
            if (loggedInCta) {
                loggedInCta.classList.remove('hidden');
                loggedInCta.style.display = 'flex'; // Restore flex display
            }

            if (navAvatar) {
                if (currentUser.avatar) {
                    navAvatar.innerHTML = `<img src="${currentUser.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                    navAvatar.style.background = 'transparent';
                } else {
                    navAvatar.textContent = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : '?';
                    navAvatar.style.background = '#00f2ff';
                }
            }

            // --- Home Page Post-Login UI ---
            if (isHomePage && roleChoiceArea) {
                // Always show content, but show selection buttons only for logged in
                roleChoiceArea.classList.remove('hidden');

                // Ensure the selector is visible if not in choice mode
                const roleSelector = document.querySelector('.role-selector-container');
                if (roleSelector) roleSelector.classList.remove('hidden');

                // If role is already selected in session/local, show that view
                const selectedRole = localStorage.getItem('4ends_active_role');
                if (selectedRole) {
                    roleChoiceArea.classList.add('hidden');
                    window.switchRoleView(selectedRole);
                }
            }

            // Ensure Profile and Edit Profile exist in dropdown
            if (userDropdown && !document.getElementById('nav-profile-btn')) {
                // Profile Link
                const profileBtn = document.createElement('button');
                profileBtn.className = 'dropdown-item';
                profileBtn.id = 'nav-profile-btn';
                profileBtn.textContent = 'Dashboard';
                profileBtn.onclick = () => window.location.href = isHomePage ? 'profile/' : '../profile/';
                userDropdown.insertBefore(profileBtn, document.getElementById('logout-btn-nav'));

                // Edit Profile Link
                const editBtn = document.createElement('button');
                editBtn.className = 'dropdown-item';
                editBtn.id = 'edit-profile-btn';
                editBtn.textContent = 'Edit Profile';
                userDropdown.insertBefore(editBtn, document.getElementById('logout-btn-nav'));

                // Re-bind the click event
                if (typeof bindEditProfileEvent === 'function') {
                    bindEditProfileEvent(editBtn);
                }
            }

            // Global removal of main navigation Profile link after login
            document.querySelectorAll('.nav-links a, .nav-link').forEach(link => {
                const text = link.textContent.trim();
                const href = link.getAttribute('href') || link.getAttribute('data-href') || '';
                if ((text === 'Profile' || href.includes('profile/')) && !link.id.includes('login-btn')) {
                    link.classList.add('hidden');
                }
            });

            // Show Admin stuff if applicable
            if (ADMIN_EMAILS.includes(currentUser.email)) {
                if (navCtaButtons) {
                    navCtaButtons.querySelectorAll('.nav-btn-social').forEach(btn => btn.classList.remove('hidden'));
                }
            }
        } else {
            // Logged Out
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (connectBtn) connectBtn.classList.remove('hidden');
            if (userInfo) userInfo.classList.add('hidden');
            if (navCtaButtons) {
                navCtaButtons.querySelectorAll('.nav-btn-social').forEach(btn => btn.classList.add('hidden'));
            }

            // Hero CTA toggling
            if (guestCta) guestCta.classList.remove('hidden');
            if (loggedInCta) loggedInCta.classList.add('hidden');

            // Show the "Profile" link in the navbar
            document.querySelectorAll('.nav-links a').forEach(link => {
                const text = link.textContent.trim();
                const href = link.getAttribute('href') || link.getAttribute('data-href') || '';
                if (text === 'Profile' || href.includes('profile/')) {
                    link.classList.remove('hidden');
                }
            });
        }

        // --- Page Specific UI ---
        if (isProfilePage) {
            if (currentUser) {
                // Show Profile Dashboard, Hide Login Form
                if (authContainer) authContainer.classList.add('hidden');
                if (profileDashboard) {
                    profileDashboard.classList.remove('hidden');

                    // Check for edit trigger in session storage
                    if (sessionStorage.getItem('trigger_profile_edit') === 'true') {
                        sessionStorage.removeItem('trigger_profile_edit');
                        // Small delay to ensure all DOM and listeners are ready
                        setTimeout(() => {
                            const editBtn = document.getElementById('edit-profile-btn');
                            if (editBtn) editBtn.click();
                        }, 300);
                    } else {
                        // Pre-fill profile if active
                        loadProfileData();
                    }
                }
            } else {
                // Show Login Form, Hide Profile Dashboard
                if (authContainer) authContainer.classList.remove('hidden');
                if (profileDashboard) profileDashboard.classList.add('hidden');
            }
        }
    };

    // --- Tournament card filter definition ---
    window.filterTournaments = (gameFilter, subType = 'all') => {
        const tournamentCards = document.querySelectorAll('.tournament-card');
        tournamentCards.forEach(card => {
            const game = card.getAttribute('data-game');
            const tag = card.querySelector('.tag') ? card.querySelector('.tag').textContent.trim().toLowerCase() : '';

            let matchesGame = gameFilter === 'all' || game === gameFilter;
            let matchesType = true;

            if (gameFilter === 'free-fire' && subType !== 'all') {
                if (subType === 'live') matchesType = tag === 'live now';
                else if (subType === 'future') matchesType = tag === 'registration open';
                else if (subType === 'past') matchesType = tag === 'completed';
            }

            if (matchesGame && matchesType) {
                card.style.display = 'block';
                card.style.opacity = '0';
                setTimeout(() => { card.style.opacity = '1'; }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- Orphaned code removed ---

    // Open/Close Modals


    // Updated close logic for multiple modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // User Dropdown Toggle
    if (navAvatar) {
        navAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            if (userDropdown) userDropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', () => {
        if (userDropdown) userDropdown.classList.remove('active');
    });



    // const googlePicker = document.getElementById('google-picker-modal'); // Removed

    // Google Login - Show Picker
    // Google Login - Show Picker (Now handled by GIS Button inside modal)
    // We don't need a click listener on a custom button anymore 
    // because the Google button is rendered directly.
    /*
    document.getElementById('google-login').addEventListener('click', () => {
        // ...
    });
    */

    // Unified handleAuth for all login methods
    // Unified handleAuth for all login methods
    const handleAuth = (email, type = 'email') => {
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        // Google Auto-Login
        if (type === 'google') {
            if (users[email]) {
                loginUser(users[email]);
            } else {
                startOnboarding(email, type);
            }
            return;
        }

        // Email Login
        if (users[email]) {
            const passwordGroup = document.getElementById('password-group');
            const passwordInput = document.getElementById('password-input');
            const passwordBtn = document.getElementById('password-login-btn');

            if (passwordGroup) passwordGroup.classList.remove('hidden');
            if (passwordInput) passwordInput.focus();

            // Clear previous listeners
            const newBtn = passwordBtn.cloneNode(true);
            passwordBtn.parentNode.replaceChild(newBtn, passwordBtn);

            newBtn.addEventListener('click', () => {
                const enteredPass = passwordInput.value;
                if (enteredPass === users[email].password) {
                    loginUser(users[email]);
                } else {
                    alert('Incorrect Password!');
                }
            });
        } else {
            startOnboarding(email, type);
        }
    };

    const loginUser = (user) => {
        currentUser = user;
        if (ADMIN_EMAILS.includes(user.email)) currentUser.isAdmin = true;
        localStorage.setItem('4ends_current_user', JSON.stringify(currentUser));
        updateUIState();
        sendDiscordLog('Login', currentUser);
        sessionStorage.setItem('show_social_popup', 'true'); // Trigger popup

        // Reset UI State
        const passwordGroup = document.getElementById('password-group');
        if (passwordGroup) passwordGroup.classList.add('hidden');
        const passwordInput = document.getElementById('password-input');
        if (passwordInput) passwordInput.value = '';

        // Redirect to Home Page if on Profile page
        if (isProfilePage) {
            window.location.href = '../';
        }
    };

    // --- Google Identity Services (GIS) Logic ---

    // Decode JWT (Basic implementation)
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
        const responsePayload = parseJwt(response.credential);

        if (responsePayload) {
            // Auto-fill user data if new
            const email = responsePayload.email;

            // In a real app, verify signature on backend.
            handleAuth(email, 'google');

            // Update Avatar if allowed/needed
            if (users[email] && !users[email].avatar) {
                users[email].avatar = responsePayload.picture;
                localStorage.setItem('4ends_users', JSON.stringify(users));
            }
            if (currentUser && !currentUser.avatar) {
                currentUser.avatar = responsePayload.picture;
                localStorage.setItem('4ends_current_user', JSON.stringify(currentUser));
                updateUIState();
            }
        }
    };

    // Initialize Google Button
    window.onload = function () {
        if (typeof google !== 'undefined') {
            // Create a hidden container for centered prompt if it doesn't exist
            let promptContainer = document.getElementById('google-prompt-container');
            if (!promptContainer) {
                promptContainer = document.createElement('div');
                promptContainer.id = 'google-prompt-container';
                promptContainer.style.position = 'fixed';
                promptContainer.style.top = '50%';
                promptContainer.style.left = '50%';
                promptContainer.style.transform = 'translate(-50%, -50%)';
                promptContainer.style.zIndex = '9999';
                document.body.appendChild(promptContainer);
            }

            google.accounts.id.initialize({
                client_id: "274347806492-pt63kvip6of0c4o9ucb7t381q8r6fdn5.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: false,
                prompt_parent_id: 'google-prompt-container' // Force center
            });

            // Render the button
            const btnContainer = document.getElementById("google-btn-container");
            if (btnContainer) {
                google.accounts.id.renderButton(
                    btnContainer,
                    { theme: "filled_black", size: "large", width: "100%" }
                );
            }
        }
    };

    // Google Picker Listeners Removed (Simulated)

    // 3. Direct Email Input (Normal Email)
    const emailNext = document.getElementById('email-next');
    if (emailNext) {
        emailNext.addEventListener('click', () => {
            const emailInput = document.getElementById('email-input');
            const email = emailInput ? emailInput.value : '';
            if (email) {
                handleAuth(email, 'email');
            }
        });
    }

    const startOnboarding = (email, type = 'email') => {
        if (authContainer) authContainer.classList.add('hidden');
        if (profileDashboard) profileDashboard.classList.remove('hidden');

        const emailField = document.getElementById('profile-email');
        if (emailField) emailField.value = email;

        // Hide/Show Password Fields based on type
        const passRow = document.querySelector('#reg-password').closest('.form-row');
        if (passRow) {
            if (type === 'google') {
                passRow.style.display = 'none';
            } else {
                passRow.style.display = 'flex';
            }
        }

        // Reset locked fields for new user
        const fields = ['gender', 'dob', 'mobile-number', 'country'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });

        showStep(1);
    };



    // Cancel Onboarding
    // Cancel Onboarding
    const cancelBtn = document.getElementById('cancel-profile');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Return to Login View
            if (authContainer) authContainer.classList.remove('hidden');
            if (profileDashboard) profileDashboard.classList.add('hidden');
        });
    }

    // Avatar Upload Logic
    const avatarInput = document.getElementById('avatar-upload');
    const setupAvatar = document.getElementById('setup-avatar');
    if (avatarInput && setupAvatar) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (['image/jpeg', 'image/png'].includes(file.type)) {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        const base64 = readerEvent.target.result;
                        setupAvatar.innerHTML = `<img src="${base64}" style="width:100%; height:100%; border-radius:20px; object-fit:cover;">`;
                        if (currentUser) {
                            currentUser.avatar = base64;
                            // Sync with users store immediately
                            if (users[currentUser.email]) {
                                users[currentUser.email].avatar = base64;
                                localStorage.setItem('4ends_users', JSON.stringify(users));
                            }
                            localStorage.setItem('4ends_current_user', JSON.stringify(currentUser));
                            updateUIState(); // Refresh navbar
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please upload only .jpg or .png images.');
                    avatarInput.value = '';
                }
            }
        });
    }

    // Step Navigation
    // --- Profile Data Loader ---
    const loadProfileData = () => {
        if (!currentUser) return;

        // Hide all steps, show Dashboard
        document.querySelectorAll('.profile-step-view').forEach(v => v.classList.remove('active'));
        const dashboard = document.getElementById('dashboard-view');
        if (dashboard) {
            dashboard.classList.add('active');
            // Hide onboarding nav steps
            const onboardingNav = document.getElementById('onboarding-steps');
            if (onboardingNav) onboardingNav.classList.add('hidden');
        }

        // Fill data anyway so "Edit Profile" is ready
        const fields = {
            'full-name': currentUser.fullName,
            'username': currentUser.username,
            'profile-email': currentUser.email,
            'gender': currentUser.gender,
            'dob': currentUser.dob,
            'mobile-number': currentUser.phone,
            'country': currentUser.country
        };

        for (const [id, value] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = value || '';
        }

        // Sync games
        selectedGames = currentUser.preferences ? [...currentUser.preferences] : [];
        document.querySelectorAll('.game-item').forEach(item => {
            const g = item.getAttribute('data-game');
            if (selectedGames.includes(g)) item.classList.add('selected');
            else item.classList.remove('selected');
        });
    };

    // Step Navigation - Updated to handle Dashboard vs Onboarding
    const showStep = (step) => {
        // Show onboarding nav if we are in steps
        const onboardingNav = document.getElementById('onboarding-steps');
        if (onboardingNav) onboardingNav.classList.remove('hidden');

        document.querySelectorAll('.profile-step-view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

        const stepEl = document.getElementById(`step-${step}`);
        const stepNavEl = document.getElementById(`step-nav-${step}`);
        if (stepEl) stepEl.classList.add('active');
        if (stepNavEl) stepNavEl.classList.add('active');

        // Hide dashboard if it exists
        const dashboard = document.getElementById('dashboard-view');
        if (dashboard) dashboard.classList.remove('active');
    };

    const toStep2 = document.getElementById('to-step-2');
    if (toStep2) {
        toStep2.addEventListener('click', () => {
            const nameEl = document.getElementById('full-name');
            const userEl = document.getElementById('username');
            const name = nameEl ? nameEl.value : '';
            const user = userEl ? userEl.value : '';
            if (name && user) showStep(2);
            else alert('Please fill required fields');
        });
    }

    const backTo1 = document.getElementById('back-to-1');
    if (backTo1) {
        backTo1.addEventListener('click', (e) => {
            e.preventDefault();
            showStep(1);
        });
    }

    const toStep3 = document.getElementById('to-step-3');
    if (toStep3) {
        toStep3.addEventListener('click', (e) => {
            e.preventDefault();
            // showStep(3); // If Step 3 exists
        });
    }

    const backTo2 = document.getElementById('back-to-2');
    if (backTo2) {
        backTo2.addEventListener('click', (e) => {
            e.preventDefault();
            showStep(2);
        });
    }

    // Game Selection - Make it more robust
    let selectedGames = (currentUser && currentUser.preferences) ? [...currentUser.preferences] : [];

    const gameItems = document.querySelectorAll('.game-item');
    if (gameItems.length > 0) {
        // Initial sync of UI with selectedGames
        gameItems.forEach(item => {
            const game = item.getAttribute('data-game');
            if (selectedGames.includes(game)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }

            item.addEventListener('click', () => {
                if (item.classList.contains('coming-soon')) {
                    alert('This game is coming soon! Please select from available games (BGMI or Free Fire).');
                    return;
                }

                const g = item.getAttribute('data-game');
                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                    selectedGames = selectedGames.filter(x => x !== g);
                } else {
                    if (selectedGames.length < 2) {
                        item.classList.add('selected');
                        selectedGames.push(g);
                    } else {
                        alert('You can only select 2 games.');
                    }
                }
            });
        });
    }

    // Finish Onboarding / Save Profile
    const finishBtn = document.getElementById('finish-profile');
    if (finishBtn) {
        finishBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Determine which user we are editing (Current or Admin Selection)
            const targetEmail = adminEditingEmail ? adminEditingEmail : document.getElementById('profile-email').value;
            const existingUser = users[targetEmail];

            // Safe value getter
            const val = (id) => {
                const el = document.getElementById(id);
                return el ? el.value : '';
            };

            const username = val('username');
            const fullName = val('full-name');
            const phone = val('mobile-number');
            const country = val('country');
            const pass = val('reg-password');
            const confirmPass = val('reg-confirm-password');

            if (!username || !fullName || !phone || !country) {
                alert('Profile Incomplete! Please fill in all fields (Name, Username, Mobile, Country).');
                showStep(1);
                return;
            }

            // Password Validation
            const passEl = document.querySelector('#reg-password');
            const passRow = passEl ? passEl.closest('.form-row') : null;
            const isEmailFlow = passRow && passRow.style.display !== 'none';

            if (isEmailFlow) {
                const isEditing = !!existingUser;
                const anyPassFilled = pass || confirmPass;

                // Mandatory for registration; Optional for editing (unless one is partially filled)
                if (!isEditing || anyPassFilled) {
                    if (!pass || !confirmPass) {
                        alert('Please enter and confirm your password.');
                        showStep(1);
                        return;
                    }
                    if (pass !== confirmPass) {
                        alert('Passwords do not match!');
                        showStep(1);
                        return;
                    }
                }
            }

            if (existingUser) {
                const isAdmin = ADMIN_EMAILS.includes(currentUser.email);

                existingUser.username = username;
                existingUser.fullName = fullName;
                existingUser.preferences = selectedGames;

                // Sync avatar from currentUser if editing self
                if (!adminEditingEmail || adminEditingEmail === currentUser.email) {
                    if (currentUser.avatar) existingUser.avatar = currentUser.avatar;
                }

                // Only change these if admin (to prevent saving masked values)
                if (isAdmin) {
                    existingUser.phone = phone;
                    existingUser.country = country;
                    existingUser.gender = val('gender');
                    existingUser.dob = val('dob');
                    if (pass && passRow && passRow.style.display !== 'none') existingUser.password = pass;
                }

                users[targetEmail] = existingUser;
                localStorage.setItem('4ends_users', JSON.stringify(users));

                // Only update current session if we are editing ourselves
                if (!adminEditingEmail || adminEditingEmail === currentUser.email) {
                    currentUser = existingUser;
                    localStorage.setItem('4ends_current_user', JSON.stringify(currentUser));
                }

                alert(`User ${targetEmail} updated successfully!`);
            } else {
                if (selectedGames.length !== 2) {
                    alert('Please select exactly 2 games.');
                    showStep(2);
                    return;
                }
                const userData = {
                    email: targetEmail,
                    username: username,
                    fullName: fullName,
                    gender: val('gender'),
                    dob: val('dob'),
                    phone: phone,
                    country: country,
                    preferences: selectedGames,
                    password: (passRow && passRow.style.display !== 'none') ? pass : 'GOOGLE_AUTH',
                    avatar: null
                };

                users[targetEmail] = userData;

                if (!adminEditingEmail) {
                    currentUser = userData;
                    localStorage.setItem('4ends_current_user', JSON.stringify(currentUser));
                    sendDiscordLog('Registration Complete', userData);
                }
            }

            localStorage.setItem('4ends_users', JSON.stringify(users));

            // Hide overlay and update state
            // Hide overlay and update state
            // If finishing, redirect to Tournaments
            if (!adminEditingEmail) {
                updateUIState();
                sendDiscordLog('Login', currentUser);
                sessionStorage.setItem('show_social_popup', 'true'); // Trigger popup
                window.location.href = '../';
            }

            // Reset Admin Flag
            if (adminEditingEmail) {
                adminEditingEmail = null;
                // Re-open admin dashboard to see changes? Optional.
                const title = document.querySelector('#step-1 h2');
                if (title) title.innerHTML = `JOIN THE <span class="accent">COMMAND</span>`;
            }

            // Ensure redirect to main view
            window.scrollTo(0, 0);
            console.log('Setup finished and closed.');
        });
    }

    const exportUsersJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "4ends_user_database.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        alert('User database exported to 4ends_user_database.json!');
    };

    const saveLocalLog = (event, user) => {
        const logs = JSON.parse(localStorage.getItem('4ends_logs')) || [];
        logs.unshift({
            event: event,
            username: user.username,
            email: user.email,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('4ends_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100
    };

    const renderLocalLogs = () => {
        const container = document.getElementById('logs-container');
        const logs = JSON.parse(localStorage.getItem('4ends_logs')) || [];
        if (logs.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted);">No logs available.</div>';
            return;
        }
        container.innerHTML = logs.map(log => `
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0.5rem 0;">
                <span style="color: var(--primary)">[${log.time}]</span> 
                <span style="color: #fff">User: ${log.username}</span> 
                <span style="color: var(--text-muted)">- ${log.event}</span>
            </div>
        `).join('');
    };

    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn-nav');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sendDiscordLog('Logout', currentUser);
            currentUser = null;
            localStorage.removeItem('4ends_current_user');
            updateUIState();
            if (userDropdown) userDropdown.classList.remove('active');
            // Clear locked fields state
            document.querySelectorAll('input, select').forEach(el => el.disabled = false);
        });
    }

    const maskPhone = (phone) => {
        if (!phone) return '';
        const clean = phone.replace(/\s/g, '');
        if (clean.length < 5) return phone;
        // Show starting 2 and ending 2
        return clean.slice(0, 2) + '*'.repeat(clean.length - 4) + clean.slice(-2);
    };

    // Logic to bind or re-bind Edit Profile event
    const bindEditProfileEvent = (btn) => {
        btn.addEventListener('click', () => {
            if (currentUser) {
                if (!isProfilePage) {
                    // Set trigger flag in session instead of URL
                    sessionStorage.setItem('trigger_profile_edit', 'true');
                    // Redirect to profile page
                    // If we are at root (Home), just go to 'profile/'
                    // If we are in any subfolder (About, Tournaments), go to '../profile/'
                    const redirectPath = isHomePage ? 'profile/' : '../profile/';
                    window.location.href = redirectPath;
                    return;
                }

                if (profileDashboard) profileDashboard.classList.remove('hidden');
                if (authContainer) authContainer.classList.add('hidden');

                const profileEmail = document.getElementById('profile-email');
                if (profileEmail) profileEmail.value = currentUser.email;

                const usernameEl = document.getElementById('username');
                if (usernameEl) usernameEl.value = currentUser.username;

                const fullNameEl = document.getElementById('full-name');
                if (fullNameEl) fullNameEl.value = currentUser.fullName;

                const genderEl = document.getElementById('gender');
                if (genderEl) genderEl.value = currentUser.gender || '';

                const dobEl = document.getElementById('dob');
                if (dobEl) dobEl.value = currentUser.dob || '';

                const mobileEl = document.getElementById('mobile-number');
                if (mobileEl) mobileEl.value = maskPhone(currentUser.phone);

                const countryEl = document.getElementById('country');
                if (countryEl) countryEl.value = currentUser.country || '';

                // Role-based Field Locking
                const isAdmin = ADMIN_EMAILS.includes(currentUser.email);

                if (!isAdmin) {
                    // Normal Users: Only Name and Username
                    if (genderEl) genderEl.disabled = true;
                    if (dobEl) dobEl.disabled = true;
                    if (mobileEl) mobileEl.disabled = true;
                    if (countryEl) countryEl.disabled = true;
                    if (profileEmail) profileEmail.disabled = true;
                } else {
                    // Admins: Everything editable
                    if (genderEl) genderEl.disabled = false;
                    if (dobEl) dobEl.disabled = false;
                    if (mobileEl) mobileEl.disabled = false;
                    if (countryEl) countryEl.disabled = false;
                    if (profileEmail) profileEmail.disabled = false;
                }

                if (userDropdown) userDropdown.classList.remove('active');

                selectedGames = currentUser.preferences ? [...currentUser.preferences] : [];
                document.querySelectorAll('.game-item').forEach(item => {
                    const g = item.getAttribute('data-game');
                    if (selectedGames.includes(g)) item.classList.add('selected');
                    else item.classList.remove('selected');
                });

                showStep(1);
            }
        });
    };

    // Edit Profile Logic (existing or new)
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        bindEditProfileEvent(editProfileBtn);
    }

    // Admin Dashboard listener
    // Admin Dashboard - Disabled for cleanup
    const adminLogsModal = document.getElementById('admin-logs-modal'); // likely null
    /*
    document.getElementById('admin-dash-btn').addEventListener('click', (e) => {
         // ...
    });
    */

    const clearLogsBtn = document.getElementById('clear-logs-btn');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all system logs?')) {
                localStorage.removeItem('4ends_logs');
                renderLocalLogs();
            }
        });
    }

    const downloadLogsBtn = document.getElementById('download-logs-btn');
    if (downloadLogsBtn) {
        downloadLogsBtn.addEventListener('click', () => {
            const logs = JSON.parse(localStorage.getItem('4ends_logs')) || [];
            const csv = "Time,Username,Email,Event\n" + logs.map(l => `${l.time},${l.username},${l.email},${l.event}`).join("\n");
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', '4ends_system_logs.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Social Buttons Actions
    const orgBtn = document.getElementById('org-btn');
    if (orgBtn) {
        orgBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const confirmMsg = `Welcome to Organization Management, ${currentUser.username}!\n\nYou can now create tournaments. Would you like to create a new one? (Bypasses manual owner confirmation for demo)`;
            if (confirm(confirmMsg)) {
                const tournamentName = prompt('Enter Tournament Name:');
                if (tournamentName) {
                    alert(`SUCCESS: Tournament "${tournamentName}" has been created and published instantly!`);
                    sendDiscordLog(`Created Tournament: ${tournamentName}`, currentUser);
                }
            }
        });
    }

    const clanBtn = document.getElementById('clan-btn');
    if (clanBtn) {
        clanBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Clan Management coming soon!');
        });
    }

    const teamsBtn = document.getElementById('teams-btn');
    if (teamsBtn) {
        teamsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Teams Management coming soon!');
        });
    }

    // Hero Section Buttons
    const heroCreateTeam = document.getElementById('hero-create-team-btn');
    if (heroCreateTeam) {
        heroCreateTeam.addEventListener('click', () => {
            alert('Team Creation Module coming soon!');
        });
    }

    const heroCreateOrg = document.getElementById('hero-create-org-btn');
    if (heroCreateOrg) {
        heroCreateOrg.addEventListener('click', () => {
            alert('Organization Registration Module coming soon!');
        });
    }

    // Initialize state
    updateUIState();
    checkSocialPopup(); // Check for popup flag

    // --- Shared Ticker Logic ---
    const tickerContent = document.getElementById('live-ticker-content');
    if (tickerContent) {
        if (LIVE_TOURNAMENTS.length > 0) {
            const items = LIVE_TOURNAMENTS.map(name => `<div class="ticker-item">${name}</div>`).join('');
            tickerContent.innerHTML = items + items; // Double it for seamless loop
        } else {
            tickerContent.innerHTML = '<div class="ticker-item">No live tournaments at the moment</div>';
        }
    }

    // --- Tournament Filtering Logic ---
    if (isTournamentsPage) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const tournamentCards = document.querySelectorAll('.tournament-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                if (filter === 'free-fire') {
                    // Show FF Modal instead of immediate filtering
                    const ffModal = document.getElementById('ff-modal');
                    if (ffModal) ffModal.classList.add('active');
                } else {
                    filterTournaments(filter);
                }
            });
        });

        // FF Modal Logic
        const ffModal = document.getElementById('ff-modal');
        const ffClose = document.getElementById('close-ff-modal');
        const ffOptions = document.querySelectorAll('.modal-option-card');

        if (ffModal && ffClose) {
            ffClose.addEventListener('click', () => ffModal.classList.remove('active'));

            // Close on outside click
            ffModal.addEventListener('click', (e) => {
                if (e.target === ffModal) ffModal.classList.remove('active');
            });

            ffOptions.forEach(opt => {
                opt.addEventListener('click', () => {
                    const type = opt.getAttribute('data-type');
                    ffModal.classList.remove('active');

                    // Filter based on type
                    filterTournaments('free-fire', type);
                });
            });
        }
    }

    if (roleBtns.length > 0) {
        roleBtns.forEach(btn => {
            btn.onclick = () => { // Use onclick for directness
                const role = btn.getAttribute('data-role');
                console.log('Role button clicked:', role);
                window.switchRoleView(role);
                if (currentUser) {
                    localStorage.setItem('4ends_active_role', role);
                }
            };
        });
    }

    if (roleChoiceBtns.length > 0) {
        roleChoiceBtns.forEach(btn => {
            btn.onclick = () => {
                const role = btn.getAttribute('data-role');
                localStorage.setItem('4ends_active_role', role);
                if (roleChoiceArea) roleChoiceArea.classList.add('hidden');
                const roleSelector = document.querySelector('.role-selector-container');
                if (roleSelector) roleSelector.classList.remove('hidden');
                window.switchRoleView(role);

                const target = document.getElementById('how-it-works');
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            };
        });
    }

    // --- Page Specific Logic ---
    if (isTournamentsPage) {
        const tournamentCards = document.querySelectorAll('.tournament-card');
        function filterTournaments(gameFilter, subType = 'all') {
            tournamentCards.forEach(card => {
                const game = card.getAttribute('data-game');
                const tag = card.querySelector('.tag') ? card.querySelector('.tag').textContent.trim().toLowerCase() : '';

                let matchesGame = gameFilter === 'all' || game === gameFilter;
                let matchesType = true;

                if (gameFilter === 'free-fire' && subType !== 'all') {
                    if (subType === 'live') matchesType = tag === 'live now';
                    else if (subType === 'future') matchesType = tag === 'registration open';
                    else if (subType === 'past') matchesType = tag === 'completed';
                }

                if (matchesGame && matchesType) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }

    console.log('4ENDS ESPORTS Website initialized with Wallet and Auth.');
});

// --- Social Popup Logic ---
const checkSocialPopup = () => {
    if (sessionStorage.getItem('show_social_popup') === 'true') {
        createSocialPopup();
        sessionStorage.removeItem('show_social_popup');
    }
};

const createSocialPopup = () => {
    const popupHTML = `
        <div class="popup-overlay active" id="social-popup-overlay">
            <div class="social-popup">
                <button class="popup-close" id="close-social-popup">&times;</button>
                <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Join the <span class="accent">Community</span></h2>
                <p style="color: var(--text-muted);">Stay updated with tournaments, news, and giveaways!</p>
                
                <div class="social-grid">
                    <a href="#" class="social-card whatsapp" target="_blank">
                        <span class="social-icon">📱</span>
                        <span>WhatsApp</span>
                    </a>
                    <a href="#" class="social-card instagram" target="_blank">
                        <span class="social-icon">📸</span>
                        <span>Instagram</span>
                    </a>
                    <a href="#" class="social-card youtube" target="_blank">
                        <span class="social-icon">▶️</span>
                        <span>YouTube</span>
                    </a>
                    <a href="#" class="social-card discord" target="_blank">
                        <span class="social-icon">💬</span>
                        <span>Discord</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    document.getElementById('close-social-popup').addEventListener('click', () => {
        document.getElementById('social-popup-overlay').classList.remove('active');
        setTimeout(() => {
            document.getElementById('social-popup-overlay').remove();
        }, 300);
    });
};

// --- Universal Card Tilt Effect ---
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.profile-card, .card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (card.classList.contains('profile-card')) {
            // Screen center logic for login card
            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const offsetX = x - midX;
            const offsetY = y - midY;
            const rotateX = (offsetY / midY) * -10;
            const rotateY = (offsetX / midX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            // Hover-based logic for tournament cards
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                const midX = rect.left + rect.width / 2;
                const midY = rect.top + rect.height / 2;
                const offsetX = x - midX;
                const offsetY = y - midY;
                const rotateX = (offsetY / (rect.height / 2)) * -10;
                const rotateY = (offsetX / (rect.width / 2)) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            } else {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            }
        }
    });
});

// ============================================================
// TEAM & ORGANIZATION MANAGEMENT SYSTEM
// ============================================================

// Generate unique 8-character invite code
const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar chars
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check if code already exists
    const teams = JSON.parse(localStorage.getItem('4ends_teams')) || {};
    const orgs = JSON.parse(localStorage.getItem('4ends_orgs')) || {};
    if (teams[code] || orgs[code]) {
        return generateInviteCode(); // Regenerate if exists
    }
    return code;
};

// Get user's current team
const getUserTeam = (userEmail) => {
    const teams = JSON.parse(localStorage.getItem('4ends_teams')) || {};
    for (const teamId in teams) {
        const team = teams[teamId];
        if (team.igl === userEmail) return { team, role: 'igl' };
        for (const role in team.members) {
            if (team.members[role] === userEmail) {
                return { team, role };
            }
        }
    }
    return null;
};

// Get user's current organization
const getUserOrg = (userEmail) => {
    const orgs = JSON.parse(localStorage.getItem('4ends_orgs')) || {};
    for (const orgId in orgs) {
        const org = orgs[orgId];
        if (org.owner === userEmail) return { org, role: 'owner' };
        if (org.admins.includes(userEmail)) return { org, role: 'admin' };
    }
    return null;
};

// Check if email is registered
const isEmailRegistered = (email) => {
    const users = JSON.parse(localStorage.getItem('4ends_users')) || {};
    return users.hasOwnProperty(email);
};

// Create Team
const createTeam = (teamName, roleEmails) => {
    if (!currentUser) {
        alert('You must be logged in to create a team!');
        return false;
    }

    // Check if user already in a team
    if (getUserTeam(currentUser.email)) {
        alert('You are already in a team! Leave your current team first.');
        return false;
    }

    // Validate all emails are registered
    const allEmails = Object.values(roleEmails);
    for (const email of allEmails) {
        if (!isEmailRegistered(email)) {
            alert`Email ${email} is not registered. All team members must have accounts!`;
            return false;
        }
        // Check if email is already in a team
        if (getUserTeam(email)) {
            alert(`${email} is already in a team!`);
            return false;
        }
    }

    // Create team
    const teams = JSON.parse(localStorage.getItem('4ends_teams')) || {};
    const inviteCode = generateInviteCode();
    const teamId = inviteCode;

    teams[teamId] = {
        id: teamId,
        name: teamName,
        igl: currentUser.email,
        members: roleEmails,
        inviteCode: inviteCode,
        createdAt: new Date().toISOString(),
        allowedEmails: [...Object.values(roleEmails), currentUser.email] // Track who can join
    };

    localStorage.setItem('4ends_teams', JSON.stringify(teams));
    return inviteCode;
};

// Join Team
const joinTeam = (code) => {
    if (!currentUser) {
        alert('You must be logged in to join a team!');
        return false;
    }

    // Check if user already in a team
    if (getUserTeam(currentUser.email)) {
        alert('You are already in a team! Leave your current team first.');
        return false;
    }

    const teams = JSON.parse(localStorage.getItem('4ends_teams')) || {};
    const team = teams[code];

    if (!team) {
        alert('Invalid invite code!');
        return false;
    }

    // Check if user's email is in allowed list
    if (!team.allowedEmails.includes(currentUser.email)) {
        alert('This invite code is not for your email address!');
        return false;
    }

    // Check if user is IGL (automatically in team)
    if (team.igl === currentUser.email) {
        alert('You are the team leader! You are already in this team.');
        return true;
    }

    // User is already validated - they can join
    alert(`Successfully joined ${team.name}!`);
    return true;
};

// Create Organization
const createOrganization = (orgName, adminEmails) => {
    if (!currentUser) {
        alert('You must be logged in to create an organization!');
        return false;
    }

    // Check if user already in an org
    if (getUserOrg(currentUser.email)) {
        alert('You are already in an organization! Leave your current organization first.');
        return false;
    }

    // Validate admin emails (if provided)
    const validAdmins = adminEmails.filter(email => email); // Remove empty strings
    for (const email of validAdmins) {
        if (!isEmailRegistered(email)) {
            alert(`Email ${email} is not registered. All admins must have accounts!`);
            return false;
        }
        if (getUserOrg(email)) {
            alert(`${email} is already in an organization!`);
            return false;
        }
    }

    // Create organization
    const orgs = JSON.parse(localStorage.getItem('4ends_orgs')) || {};
    const inviteCode = generateInviteCode();
    const orgId = inviteCode;

    orgs[orgId] = {
        id: orgId,
        name: orgName,
        owner: currentUser.email,
        admins: validAdmins,
        inviteCode: inviteCode,
        createdAt: new Date().toISOString(),
        allowedEmails: [...validAdmins, currentUser.email]
    };

    localStorage.setItem('4ends_orgs', JSON.stringify(orgs));
    return inviteCode;
};

// Join Organization
const joinOrganization = (code) => {
    if (!currentUser) {
        alert('You must be logged in to join an organization!');
        return false;
    }

    // Check if user already in an org
    if (getUserOrg(currentUser.email)) {
        alert('You are already in an organization! Leave your current organization first.');
        return false;
    }

    const orgs = JSON.parse(localStorage.getItem('4ends_orgs')) || {};
    const org = orgs[code];

    if (!org) {
        alert('Invalid invite code!');
        return false;
    }

    // Check if user's email is in allowed list
    if (!org.allowedEmails.includes(currentUser.email)) {
        alert('This invite code is not for your email address!');
        return false;
    }

    // User is validated
    alert(`Successfully joined ${org.name}!`);
    return true;
};

// Copy invite code to clipboard
window.copyInviteCode = () => {
    const code = document.getElementById('invite-code-display').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Invite code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
};

// Share invite code
window.shareInviteCode = (platform) => {
    const code = document.getElementById('invite-code-display').textContent;
    const message = `Join my team on 4ENDS ESPORTS! Use invite code: ${code}`;

    if (navigator.share) {
        navigator.share({
            title: '4ENDS ESPORTS Team Invite',
            text: message,
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${message}\nVisit: ${window.location.origin}`);
        alert('Invite message copied to clipboard!');
    }
};

// Show invite code modal
const showInviteCodeModal = (code, type) => {
    const modal = document.getElementById('invite-code-modal');
    const message = document.getElementById('invite-message');
    const codeDisplay = document.getElementById('invite-code-display');

    message.textContent = type === 'team'
        ? 'Your team has been created! Share this code with your members.'
        : 'Your organization has been created! Share this code with your admins.';
    codeDisplay.textContent = code;

    modal.classList.add('active');
};

// ============================================================
// EVENT LISTENERS FOR HOMEPAGE BUTTONS
// ============================================================

// Hero buttons - Create Team
const heroCreateTeamBtn = document.getElementById('hero-create-team-btn');
if (heroCreateTeamBtn) {
    heroCreateTeamBtn.addEventListener('click', () => {
        // Show choice modal: Create or Join
        const choiceModal = document.getElementById('choice-modal');
        const createBtn = document.getElementById('choice-create');
        const joinBtn = document.getElementById('choice-join');

        choiceModal.classList.add('active');

        // Remove old listeners
        const newCreateBtn = createBtn.cloneNode(true);
        const newJoinBtn = joinBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(newCreateBtn, createBtn);
        joinBtn.parentNode.replaceChild(newJoinBtn, joinBtn);

        newCreateBtn.addEventListener('click', () => {
            choiceModal.classList.remove('active');
            document.getElementById('create-team-modal').classList.add('active');
        });

        newJoinBtn.addEventListener('click', () => {
            choiceModal.classList.remove('active');
            document.getElementById('join-team-modal').classList.add('active');
        });
    });
}

// Hero buttons - Create Organization
const heroCreateOrgBtn = document.getElementById('hero-create-org-btn');
if (heroCreateOrgBtn) {
    heroCreateOrgBtn.addEventListener('click', () => {
        // Show choice modal: Create or Join
        const choiceModal = document.getElementById('choice-modal');
        const createBtn = document.getElementById('choice-create');
        const joinBtn = document.getElementById('choice-join');

        choiceModal.classList.add('active');

        // Remove old listeners
        const newCreateBtn = createBtn.cloneNode(true);
        const newJoinBtn = joinBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(newCreateBtn, createBtn);
        joinBtn.parentNode.replaceChild(newJoinBtn, joinBtn);

        newCreateBtn.addEventListener('click', () => {
            choiceModal.classList.remove('active');
            document.getElementById('create-org-modal').classList.add('active');
        });

        newJoinBtn.addEventListener('click', () => {
            choiceModal.classList.remove('active');
            document.getElementById('join-org-modal').classList.add('active');
        });
    });
}

// Create Team Form Submit
const createTeamForm = document.getElementById('create-team-form');
if (createTeamForm) {
    createTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const teamName = document.getElementById('team-name').value;
        const roleEmails = {
            rusher: document.getElementById('team-rusher').value,
            secondary: document.getElementById('team-secondary').value,
            allround: document.getElementById('team-allround').value,
            sniper: document.getElementById('team-sniper').value
        };

        const inviteCode = createTeam(teamName, roleEmails);

        if (inviteCode) {
            document.getElementById('create-team-modal').classList.remove('active');
            createTeamForm.reset();
            showInviteCodeModal(inviteCode, 'team');
        }
    });
}

// Join Team Form Submit
const joinTeamForm = document.getElementById('join-team-form');
if (joinTeamForm) {
    joinTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const code = document.getElementById('join-team-code').value.toUpperCase();

        if (joinTeam(code)) {
            document.getElementById('join-team-modal').classList.remove('active');
            joinTeamForm.reset();
        }
    });
}

// Create Organization Form Submit
const createOrgForm = document.getElementById('create-org-form');
if (createOrgForm) {
    createOrgForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const orgName = document.getElementById('org-name').value;
        const adminEmails = [
            document.getElementById('org-admin1').value,
            document.getElementById('org-admin2').value
        ];

        const inviteCode = createOrganization(orgName, adminEmails);

        if (inviteCode) {
            document.getElementById('create-org-modal').classList.remove('active');
            createOrgForm.reset();
            showInviteCodeModal(inviteCode, 'org');
        }
    });
}

// Join Organization Form Submit
const joinOrgForm = document.getElementById('join-org-form');
if (joinOrgForm) {
    joinOrgForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const code = document.getElementById('join-org-code').value.toUpperCase();

        if (joinOrganization(code)) {
            document.getElementById('join-org-modal').classList.remove('active');
            joinOrgForm.reset();
        }
    });
}

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
