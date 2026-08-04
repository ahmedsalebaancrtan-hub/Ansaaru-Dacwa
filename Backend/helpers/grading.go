package helpers

func CalculateGrade(marks float64, maxMarks float64) string {
	percentage := (marks / maxMarks) * 100

	switch {
	case percentage >= 90:
		return "A+"
	case percentage >= 80:
		return "A"
	case percentage >= 70:
		return "B"
	case percentage >= 60:
		return "C"
	case percentage >= 50:
		return "D"
	default:
		return "F"
	}
}
