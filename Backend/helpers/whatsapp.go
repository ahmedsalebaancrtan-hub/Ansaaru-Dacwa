package helpers

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
)

// SendWhatsAppMessage wuxuu fariinta toos ugu dirayaa UltraMsg API
func SendWhatsAppMessage(phoneNumber string, message string) error {
	// 1. Clean-up: Ka saar '+', spaces, iyo hyphens lambarka
	cleanPhone := strings.ReplaceAll(phoneNumber, "+", "")
	cleanPhone = strings.ReplaceAll(cleanPhone, " ", "")
	cleanPhone = strings.ReplaceAll(cleanPhone, "-", "")
	cleanPhone = strings.TrimSpace(cleanPhone)

	// 2. Ka soo qaad .env credentials-kaaga
	baseURL := os.Getenv("WHATSAPP_API_URL") // e.g. https://api.ultramsg.com/instance187387/
	token := os.Getenv("WHATSAPP_API_TOKEN") // e.g. nd8963fm5au5cp16

	if baseURL == "" || token == "" {
		return fmt.Errorf("WHATSAPP_API_URL ama WHATSAPP_API_TOKEN laguma dhex qdefined-greyn .env")
	}

	// 3. Hubi URL-ka in uu leeyahay endpoint-ka `/messages/chat`
	baseURL = strings.TrimSuffix(baseURL, "/")
	apiURL := fmt.Sprintf("%s/messages/chat", baseURL)

	// 4. UltraMsg Data Parameters (Form Data)
	data := url.Values{}
	data.Set("token", token)
	data.Set("to", cleanPhone)
	data.Set("body", message)

	req, err := http.NewRequest("POST", apiURL, strings.NewReader(data.Encode()))
	if err != nil {
		return fmt.Errorf("failed to create http request: %v", err)
	}

	// UltraMsg wuxuu u baahan yahay Header-kan
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("network connection error: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("ultramsg status error, code: %d", resp.StatusCode)
	}

	return nil
}
