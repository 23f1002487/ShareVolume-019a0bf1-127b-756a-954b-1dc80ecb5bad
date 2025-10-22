# Becton Dickinson Shares Outstanding Data Viewer

This web application fetches and displays the Number of Shares Outstanding for Becton Dickinson, using SEC data.

## Features
- Loads company data from SEC API, filtered for years after 2020.
- Stores processed max/min shares Outstanding data in local storage.
- Renders entity name, maximum, and minimum shares with related fiscal years.
- Supports dynamic CIK query parameter in URL.
- Automatically updates UI based on fetched data.

## How to Use
1. Open the 