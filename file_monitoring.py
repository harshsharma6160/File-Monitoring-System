import os
import time
from inotify.adapters import Inotify

def monitor_files(directory, files_to_watch):
    inotify = Inotify()
    inotify.add_watch(directory)
    print(f"Monitoring {directory} for changes...")

    try:
        for event in inotify.event_gen(yield_nones=False):
            (_, type_names, path, filename) = event
            if filename in files_to_watch and 'IN_CLOSE_WRITE' in type_names:
                print(f"File modified: {filename}")
    except KeyboardInterrupt:
        print("Monitoring stopped.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python3 file_monitoring.py <directory> <file1> <file2> ...")
        sys.exit(1)
    
    directory = sys.argv[1]
    files_to_watch = sys.argv[2:]
    monitor_files(directory, files_to_watch)

