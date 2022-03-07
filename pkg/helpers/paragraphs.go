package helpers

import "encoding/base64"

// DivideBodyIntoParagraphs divides post body into paragraphs
func DivideBodyIntoParagraphs(body string) ([]string, error) {
	var result []string
	var paragraph []byte

	base64Body, err := base64.StdEncoding.DecodeString(body)
	if err != nil {
		return result, err
	}

	for i := 0; i < len(base64Body); i++ {
		paragraph = append(paragraph, base64Body[i])

		if base64Body[i] == 13 {
			result = append(result, string(paragraph))
			i = i + 2
			paragraph = make([]byte, 0)
		}

		if len(paragraph) != 0 && i == len(base64Body)-1 {
			result = append(result, string(paragraph))
		}
	}

	return result, nil
}
