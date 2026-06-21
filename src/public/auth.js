function registerFields(fields, finalButton, errors) {
    // Trigger to re-evaluate the final button state
    const update = function() {
        updateFieldsValidity(fields, finalButton, errors);
    };

    for (let i = 0; i < fields.length; i++) {
        const currentField = fields[i];
        const nextField = fields[i+1];

        // Bind events to trigger the update function
        currentField.updateFieldsValidity = update;
        currentField.onchange = update;
        currentField.addEventListener("input", update);
        currentField.addEventListener("blur", update);
        
        if (currentField.tagName != "INPUT")
            continue;

        // Apply phone number formatter if the input type is tel
        if (currentField.type == "tel")
            registerPhoneNumberInput(currentField);
        
        // Move to the next input or click the final button when Enter is pressed
        currentField.addEventListener("keydown", function(event) {
            if (event.key == "Enter") {
                if (nextField == null)
                    finalButton.click();
                else
                    nextField.focus();
            }
        });

        // Hide error messages dynamically while user is typing
        currentField.addEventListener("input", function() {
            if (currentField.type == "email" && window["emailErrorText"]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isValid = emailRegex.test(currentField.value);

                if (isValid)
                    emailErrorText.classList.add("hidden");
            }
            else if (currentField.type == "tel" && window["phoneErrorText"]) {
                const isValid = Formatter.PhoneNumber(currentField.value, true) != "-";

                if (isValid)
                    phoneErrorText.classList.add("hidden");
            }
            else if (currentField.getAttribute("ad-type") == "nik" && window["nikErrorText"]) {
                const isValid = /[0-9]/.test(currentField.value) && currentField.value.trim().length == 16;

                if (isValid)
                    nikErrorText.classList.add("hidden");
            }
            else if (currentField.getAttribute("ad-type") == "confirmpassword") {
                const isValid = passwordInput.value == passwordConfirmInput.value;
                
                if (isValid && window["passwordErrorText"])
                    passwordErrorText.classList.add("hidden");
            }
            else if (currentField.getAttribute("ad-type") == "name") {
                const isValid = currentField.value.trim().length >= 3;

                if (isValid && window["fullnameErrorText"])
                    fullnameErrorText.classList.add("hidden");
            }
        });

        // Show error messages if the input is invalid when it loses focus
        currentField.addEventListener("blur", function() {
            if (currentField.type == "email" && window["emailErrorText"]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isValid = emailRegex.test(currentField.value);

                if (isValid)
                    emailErrorText.classList.add("hidden");
                else
                    emailErrorText.classList.remove("hidden");
            }
            else if (currentField.type == "tel" && window["phoneErrorText"]) {
                const isValid = Formatter.PhoneNumber(currentField.value, true) != "-";

                if (isValid)
                    phoneErrorText.classList.add("hidden");
                else
                    phoneErrorText.classList.remove("hidden");
            }
            else if (currentField.getAttribute("ad-type") == "nik" && window["nikErrorText"]) {
                const isValid = /[0-9]/.test(currentField.value) && currentField.value.trim().length == 16;

                if (isValid)
                    nikErrorText.classList.add("hidden");
                else
                    nikErrorText.classList.remove("hidden");
            }
            else if (currentField.getAttribute("ad-type") == "confirmpassword") {
                const isValid = passwordInput.value == passwordConfirmInput.value;
                
                if (isValid && window["passwordErrorText"])
                    passwordErrorText.classList.add("hidden");
                else if (window["passwordErrorText"])
                    passwordErrorText.classList.remove("hidden");
            }
            else if (currentField.getAttribute("ad-type") == "name") {
                const isValid = currentField.value.trim().length >= 3;

                if (isValid && window["fullnameErrorText"])
                    fullnameErrorText.classList.add("hidden");
                else if (window["fullnameErrorText"])
                    fullnameErrorText.classList.remove("hidden");
            }
        });
    }

    // Execute the bound action when the final button is clicked
    finalButton.onclick = async function(event) {
        finalButton.disabled = true;
        for (const field of fields || [])
            field.disabled = true;

        if (finalButton.children[0] && finalButton.children[0].classList.contains("progressring"))
            finalButton.children[0].style.display = "block";

        // Wait for the action promise to resolve
        const isSuccess = await finalButton.onaction();
        
        // Revert UI changes if the action failed
        if (isSuccess == false) {
            for (const field of fields || [])
                field.disabled = false;
            finalButton.disabled = false;
            
            if (finalButton.children[0] && finalButton.children[0].classList.contains("progressring"))
                finalButton.children[0].style.display = "";

            update();
        }
    }

    // Focus the first field initially
    if (fields[0]) fields[0].focus();
}

function updateFieldsValidity(fields, finalButton, errors) {
    let isEmpty = false;

    // Check if any required field is empty or unchecked
    for (const field of fields || []) {
        if (isEmpty)
            break;
        if (field.tagName == "INPUT") {
            if (field.value.trim() == "")
                isEmpty = true;
            else if (field.required && field.checked == false)
                isEmpty = true
        }
        else if (field.tagName == "SELECT") {
            if (field.value.trim() == "")
                isEmpty = true;
        }
        else {
            if (field.classList.contains("filled") == false)
                isEmpty = true;
        }
    }

    // Check if any error message is currently visible
    for (const error of errors || []) {
        if (isEmpty)
            break;
        if (error.classList.contains("hidden") == false)
            isEmpty = true;
    }

    finalButton.disabled = isEmpty;
}

function registerPhoneNumberInput(input) {
    const enforcePrefix = function() {
        let val = this.value;
        let minPos = val.startsWith("+62 ") ? 4 : (val.startsWith("+62") ? 3 : 0);
        
        if (this.selectionStart < minPos && this.selectionStart == this.selectionEnd)
            this.setSelectionRange(minPos, minPos);
    };

    input.addEventListener("click", enforcePrefix);
    input.addEventListener("keyup", enforcePrefix);
    input.addEventListener("focus", enforcePrefix);

    input.addEventListener("keydown", function(e) {
        let val = this.value;
        let minPos = val.startsWith("+62 ") ? 4 : (val.startsWith("+62") ? 3 : 0);

        // Prevent modifying the country code prefix
        if (this.selectionStart <= minPos) {
            if (e.key === "ArrowLeft") {
                e.preventDefault(); 
            }
            if (e.key === "Backspace" && this.selectionStart === minPos && this.selectionEnd === minPos) {
                e.preventDefault(); 
                this.value = "";
                this.dispatchEvent(new Event("input")); 
            }
        }
    });

    input.addEventListener("input", function() {
        let cursorPosition = this.selectionStart;
        let originalValue = this.value;
        let digitsBeforeCursor = 0;
        
        for (let i = 0; i < cursorPosition; i++) {
            if (/\d/.test(originalValue[i])) {
                digitsBeforeCursor++;
            }
        }

        let rawOriginal = originalValue.replace(/\D/g, "");
        let addedDigits = 0;
        
        if (rawOriginal.startsWith("0"))
            addedDigits = 1;
        else if (rawOriginal.length > 0 && !rawOriginal.startsWith("62") && rawOriginal !== "6")
            addedDigits = 2;
        
            
        if (digitsBeforeCursor > 0)
            digitsBeforeCursor += addedDigits;
            
        this.value = this.value.replaceAll(/[^0-9\+\-\s]/g, "");
        
        // Make sure the Formatter utility is available in your global scope
        if (typeof Formatter !== 'undefined' && Formatter.PhoneNumber) {
            this.value = Formatter.PhoneNumber(this.value, false);
        }
        
        let newCursorPos = -1;
        let digitsCounted = 0;
        
        for (let i = 0; i < this.value.length; i++) {
            if (digitsCounted === digitsBeforeCursor) {
                newCursorPos = i;
                break;
            }
            if (/\d/.test(this.value[i])) {
                digitsCounted++;
            }
        }
        
        if (newCursorPos === -1) {
            newCursorPos = this.value.length;
        }

        let minPosAfter = this.value.startsWith("+62 ") ? 4 : (this.value.startsWith("+62") ? 3 : 0);
        if (newCursorPos < minPosAfter) {
            newCursorPos = minPosAfter;
        }

        this.setSelectionRange(newCursorPos, newCursorPos);
    });
}