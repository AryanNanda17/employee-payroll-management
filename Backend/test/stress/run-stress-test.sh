#!/bin/bash
# ============================================================
# JMeter Stress Test Runner
# ============================================================
# Usage: ./run-stress-test.sh
#
# Prerequisites:
#   - JMeter installed (brew install jmeter OR download from https://jmeter.apache.org)
#   - Backend server running on localhost:5001
#   - MySQL database running
#
# This script will:
#   1. Check if JMeter is installed
#   2. Create report directories
#   3. Run the stress test plan
#   4. Generate HTML report
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEST_PLAN="$SCRIPT_DIR/stress-test-plan.jmx"
REPORT_DIR="$PROJECT_DIR/reports/stress"
RESULTS_FILE="$REPORT_DIR/results.jtl"
HTML_REPORT_DIR="$REPORT_DIR/html-report"

echo "============================================"
echo "  JMeter Stress Test Runner"
echo "============================================"
echo ""

# Check if JMeter is installed
if command -v jmeter &> /dev/null; then
    JMETER_CMD="jmeter"
elif [ -d "/usr/local/Cellar/jmeter" ]; then
    JMETER_CMD="jmeter"
elif [ -f "$HOME/apache-jmeter/bin/jmeter" ]; then
    JMETER_CMD="$HOME/apache-jmeter/bin/jmeter"
else
    echo "ERROR: JMeter is not installed!"
    echo ""
    echo "Install JMeter using one of these methods:"
    echo "  1. Homebrew (macOS):  brew install jmeter"
    echo "  2. Download:          https://jmeter.apache.org/download_jmeter.cgi"
    echo ""
    echo "After downloading, extract and add bin/ to your PATH."
    exit 1
fi

echo "JMeter found: $JMETER_CMD"
echo "Test Plan:    $TEST_PLAN"
echo "Report Dir:   $REPORT_DIR"
echo ""

# Create report directories
mkdir -p "$REPORT_DIR"

# Clean previous results
if [ -f "$RESULTS_FILE" ]; then
    echo "Removing previous results..."
    rm -f "$RESULTS_FILE"
    rm -f "$REPORT_DIR/summary.csv"
    rm -f "$REPORT_DIR/aggregate.csv"
fi

if [ -d "$HTML_REPORT_DIR" ]; then
    echo "Removing previous HTML report..."
    rm -rf "$HTML_REPORT_DIR"
fi

echo ""
echo "Starting stress test..."
echo "============================================"
echo ""

# Run JMeter in non-GUI mode
$JMETER_CMD -n \
    -t "$TEST_PLAN" \
    -l "$RESULTS_FILE" \
    -e -o "$HTML_REPORT_DIR" \
    -j "$REPORT_DIR/jmeter.log"

echo ""
echo "============================================"
echo "  Stress Test Complete!"
echo "============================================"
echo ""
echo "Results:"
echo "  - Raw results:   $RESULTS_FILE"
echo "  - Summary CSV:   $REPORT_DIR/summary.csv"
echo "  - Aggregate CSV: $REPORT_DIR/aggregate.csv"
echo "  - HTML Report:   $HTML_REPORT_DIR/index.html"
echo "  - JMeter Log:    $REPORT_DIR/jmeter.log"
echo ""
echo "Open the HTML report in a browser:"
echo "  open $HTML_REPORT_DIR/index.html"
echo ""
