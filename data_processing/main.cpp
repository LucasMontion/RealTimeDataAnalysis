#include <bits/stdc++.h>
#include <fstream>

using namespace std;

#include <fstream>
#include <iostream>
#include <sstream>

vector<vector<string>> readCSV(const string &filename) {
  vector<vector<string>> data; // Vector to store CSV data

  // Open the CSV file for reading
  ifstream file(filename);

  if (!file.is_open()) {
    cerr << "Failed to open the CSV file." << endl;
    return data; // Return an empty vector
  }

  // Read the CSV header row
  string headerLine;
  if (getline(file, headerLine)) {
    // Tokenize the header line
    istringstream headerStream(headerLine);
    string token;
    vector<string> headers;

    while (getline(headerStream, token, ',')) {
      headers.push_back(token);
    }
    data.push_back(headers);
  }

  // Read and process each data row
  string dataLine;
  while (getline(file, dataLine)) {
    // Tokenize the data line
    istringstream dataStream(dataLine);
    string token;
    vector<string> rowData;

    while (getline(dataStream, token, ',')) {
      rowData.push_back(token);
    }

    data.push_back(rowData);
  }

  // Close the CSV file
  file.close();

  return data;
}

void writeDataToCSV(const std::string &file_path,
                    map<string, vector<pair<string, vector<double>>>> &data) {
  ofstream file(file_path);

  if (!file.is_open()) {
    cerr << "Failed to open the CSV file." << endl;
    return;
  }

  string header = "Symbol,Time,std,mean,max,min,spread";
  for (auto row : data) {
    for (auto symbol : row.second) {
      file << row.first << ',';
      file << symbol.first << ',';
      file << symbol.second[0] << ',';
      file << symbol.second[1] << ',';
      file << symbol.second[2] << ',';
      file << symbol.second[3] << ',';
      file << symbol.second[4] << ',';
      file << "\n";
    }

    // Add a newline character to separate rows
  }

  // Close the CSV file
  file.close();

  cout << "Data has been written to " << file_path << std::endl;
}

int main() {
  vector<vector<string>> csvData = readCSV("../nbc_data/e2.csv");

  if (!csvData.empty()) {
    for (const vector<string> &row : csvData) {
      for (const string &cell : row) {
        // cout << cell << '\t';
      }
      // cout << std::endl;
    }
  } else {
    cout << "No data found in the CSV file." << std::endl;
  }

  map<string, vector<pair<string, int>>> mp;

  for (auto row : csvData) {
    if (row[5] == "NewOrderRequest")
      mp[row[6]].push_back({row[1], stoi(row[7])});
    cout << row[6] << endl;
  }

  map<string, vector<pair<string, vector<double>>>> new_vals;

  for (auto x : mp) {
    string s = x.first;
    // pair<string, int> val = x.second;
    for (auto val : x.second) {
      string t = val.first;
      if (new_vals[s].empty()) {
        new_vals[s].push_back(
            {t,
             {0, static_cast<double>(val.second),
              static_cast<double>(val.second), static_cast<double>(val.second),
              0, static_cast<double>(val.second),
              static_cast<double>(
                  val.second)}}); // std, mean, max, min, spread, price, sum
      } else {
        vector<double> tmp(7);
        vector<double> prev = new_vals[s][new_vals[s].size() - 1].second;
        tmp[6] = val.second + prev[6];
        // price
        tmp[5] = val.second;
        tmp[3] = val.second < prev[3] ? val.second : prev[3];
        tmp[2] = val.second > prev[3] ? val.second : prev[3];
        tmp[4] = tmp[2] - tmp[3];
        tmp[1] = tmp[6] / (new_vals[s].size() + 1); // mean
        // std
        double diff = pow(tmp[5] - tmp[1], 2);
        for (auto v : new_vals[s]) {
          diff += pow(v.second[5] - tmp[1], 2);
        }
        tmp[0] = sqrt(diff / (new_vals[s].size()));
        new_vals[s].push_back({t, tmp});
      }
    }
  }

  writeDataToCSV("e2_cpp.csv", new_vals);

  return 0;
}
