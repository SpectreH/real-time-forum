package models

// TemplateData holds data sent to index template
type TemplateData struct {
	StringMap map[string]string
	IntMap    map[string]int
	FloatMap  map[string]float32
	Data      map[string]interface{}
	Flash     string
	Error     string
}

var GlobalData TemplateData

// ClearGlobalData clears the global data variable
func ClearGlobalData() {
	GlobalData = TemplateData{}
}
