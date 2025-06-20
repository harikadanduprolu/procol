using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Text.Json;

namespace ScreenTimeTracker
{
    class Program
    {
        // Declare Windows API functions to get the active window
        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        static extern uint GetWindowThreadProcessId(IntPtr hwnd, out uint processId);

        [DllImport("user32.dll", SetLastError = true)]
        static extern int GetWindowText(IntPtr hwnd, StringBuilder lpString, int nMaxCount);

        // Data structure to store window usage information
        class WindowUsage
        {
            public string WindowTitle { get; set; }
            public string ProcessName { get; set; }
            public TimeSpan TotalTime { get; set; }
            public List<TimeSpan> Sessions { get; set; } = new List<TimeSpan>();
            public DateTime LastActive { get; set; }
        }

        // Main data structure to store all window usage data
        class ScreenTimeData
        {
            public Dictionary<string, WindowUsage> WindowUsages { get; set; } = new Dictionary<string, WindowUsage>();
            public DateTime StartTime { get; set; } = DateTime.Now;
            public DateTime LastSaveTime { get; set; } = DateTime.Now;
        }

        static ScreenTimeData screenTimeData = new ScreenTimeData();
        static string dataFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "ScreenTimeData.json");
        static bool isTracking = true;
        static bool showDetailedStats = false;

        static void Main(string[] args)
        {
            Console.Title = "Screen Time Tracker";
            Console.WriteLine("Screen Time Tracker");
            Console.WriteLine("===================");
            Console.WriteLine("Press 'S' to save data");
            Console.WriteLine("Press 'P' to pause/resume tracking");
            Console.WriteLine("Press 'D' to toggle detailed statistics");
            Console.WriteLine("Press 'Q' to quit");
            Console.WriteLine("===================");

            // Load existing data if available
            LoadData();

            // Start a separate thread for tracking
            Thread trackingThread = new Thread(TrackScreenTime);
            trackingThread.IsBackground = true;
            trackingThread.Start();

            // Main thread handles user input
            HandleUserInput();
        }

        static void TrackScreenTime()
        {
            DateTime lastSwitchTime = DateTime.Now;
            string currentWindowTitle = string.Empty;
            string currentProcessName = string.Empty;

            while (isTracking)
            {
                try
                {
                    IntPtr hwnd = GetForegroundWindow();
                    uint processId;
                    GetWindowThreadProcessId(hwnd, out processId);

                    // Get the process name
                    Process process = Process.GetProcessById((int)processId);
                    string processName = process.ProcessName;

                    // Get the window title
                    StringBuilder windowTitle = new StringBuilder(256);
                    GetWindowText(hwnd, windowTitle, windowTitle.Capacity);
                    string windowTitleStr = windowTitle.ToString();

                    // If the window has changed, update the data
                    if (currentWindowTitle != windowTitleStr)
                    {
                        if (!string.IsNullOrEmpty(currentWindowTitle))
                        {
                            // Calculate time spent on previous window
                            TimeSpan timeSpent = DateTime.Now - lastSwitchTime;
                            
                            // Update the data
                            UpdateWindowUsage(currentWindowTitle, currentProcessName, timeSpent);
                        }

                        // Update current window info
                        currentWindowTitle = windowTitleStr;
                        currentProcessName = processName;
                        lastSwitchTime = DateTime.Now;
                    }

                    // Auto-save every 5 minutes
                    if ((DateTime.Now - screenTimeData.LastSaveTime).TotalMinutes >= 5)
                    {
                        SaveData();
                    }

                    // Display summary every 30 seconds
                    if ((DateTime.Now - lastSwitchTime).TotalSeconds >= 30)
                    {
                        DisplaySummary();
                    }

                    Thread.Sleep(1000); // Check every second
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error tracking window: {ex.Message}");
                    Thread.Sleep(5000); // Wait a bit longer if there's an error
                }
            }
        }

        static void UpdateWindowUsage(string windowTitle, string processName, TimeSpan timeSpent)
        {
            string key = $"{windowTitle}|{processName}";
            
            if (!screenTimeData.WindowUsages.ContainsKey(key))
            {
                screenTimeData.WindowUsages[key] = new WindowUsage
                {
                    WindowTitle = windowTitle,
                    ProcessName = processName,
                    TotalTime = TimeSpan.Zero,
                    LastActive = DateTime.Now
                };
            }

            var usage = screenTimeData.WindowUsages[key];
            usage.TotalTime += timeSpent;
            usage.Sessions.Add(timeSpent);
            usage.LastActive = DateTime.Now;
        }

        static void DisplaySummary()
        {
            Console.Clear();
            Console.WriteLine("Screen Time Tracker");
            Console.WriteLine("===================");
            Console.WriteLine($"Tracking since: {screenTimeData.StartTime:g}");
            Console.WriteLine($"Total tracking time: {(DateTime.Now - screenTimeData.StartTime):hh\\:mm\\:ss}");
            Console.WriteLine($"Last saved: {screenTimeData.LastSaveTime:g}");
            Console.WriteLine("===================");
            
            // Sort windows by total time spent
            var sortedWindows = screenTimeData.WindowUsages.Values
                .OrderByDescending(w => w.TotalTime)
                .Take(10)
                .ToList();

            Console.WriteLine("Top 10 Most Used Applications:");
            Console.WriteLine("-------------------------------");
            
            foreach (var window in sortedWindows)
            {
                Console.WriteLine($"{window.ProcessName}: {window.TotalTime:hh\\:mm\\:ss} ({window.Sessions.Count} sessions)");
                
                if (showDetailedStats)
                {
                    Console.WriteLine($"  Window: {window.WindowTitle}");
                    Console.WriteLine($"  Last active: {window.LastActive:g}");
                    Console.WriteLine($"  Average session: {TimeSpan.FromTicks(window.TotalTime.Ticks / window.Sessions.Count):hh\\:mm\\:ss}");
                    Console.WriteLine();
                }
            }
            
            Console.WriteLine("===================");
            Console.WriteLine("Press 'S' to save data");
            Console.WriteLine("Press 'P' to pause/resume tracking");
            Console.WriteLine("Press 'D' to toggle detailed statistics");
            Console.WriteLine("Press 'Q' to quit");
        }

        static void HandleUserInput()
        {
            while (true)
            {
                if (Console.KeyAvailable)
                {
                    var key = Console.ReadKey(true).Key;
                    
                    switch (key)
                    {
                        case ConsoleKey.S:
                            SaveData();
                            Console.WriteLine("Data saved successfully!");
                            Thread.Sleep(1000);
                            break;
                            
                        case ConsoleKey.P:
                            isTracking = !isTracking;
                            Console.WriteLine(isTracking ? "Tracking resumed." : "Tracking paused.");
                            Thread.Sleep(1000);
                            break;
                            
                        case ConsoleKey.D:
                            showDetailedStats = !showDetailedStats;
                            DisplaySummary();
                            break;
                            
                        case ConsoleKey.Q:
                            SaveData();
                            Console.WriteLine("Exiting...");
                            Environment.Exit(0);
                            break;
                    }
                }
                
                Thread.Sleep(100);
            }
        }

        static void SaveData()
        {
            try
            {
                screenTimeData.LastSaveTime = DateTime.Now;
                string json = JsonSerializer.Serialize(screenTimeData, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(dataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving data: {ex.Message}");
            }
        }

        static void LoadData()
        {
            try
            {
                if (File.Exists(dataFilePath))
                {
                    string json = File.ReadAllText(dataFilePath);
                    screenTimeData = JsonSerializer.Deserialize<ScreenTimeData>(json);
                    Console.WriteLine("Previous tracking data loaded.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading data: {ex.Message}");
                screenTimeData = new ScreenTimeData();
            }
        }
    }
} 