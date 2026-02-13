#!/usr/bin/env python3
import re
import os
import sys


def extract_time_messages(input_file, output_file):
    """
    Extract messages containing the word 'time' from the chat file.
    
    Args:
        input_file (str): Path to the input chat file
        output_file (str): Path to the output file for extracted messages
    
    Returns:
        int: Number of messages found
    """
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)
    
    # Compile regex pattern for matching 'time' as a standalone word
    # \b ensures word boundaries (won't match 'sometimes', 'nytimes', etc.)
    time_pattern = re.compile(r'\btime\b', re.IGNORECASE)
    
    # Pattern to match the chat message format: [date, time] Name: Message
    message_pattern = re.compile(r'^\[.*?\] .*?: ')
    
    matching_messages = []
    total_lines = 0
    malformed_lines = 0
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                total_lines += 1
                line = line.rstrip('\n')
                
                # Skip empty lines
                if not line.strip():
                    continue
                
                # Check if line matches the expected message format
                if not message_pattern.match(line):
                    malformed_lines += 1
                    continue
                
                # Search for 'time' as a standalone word in the line
                if time_pattern.search(line):
                    matching_messages.append(line)
        
        # Write results to output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"Found {len(matching_messages)} messages containing 'time':\n")
            f.write("=" * 60 + "\n\n")
            
            for message in matching_messages:
                f.write(message + "\n")
            
            f.write("\n" + "=" * 60 + "\n")
            f.write(f"Total messages extracted: {len(matching_messages)}\n")
            f.write(f"Total lines processed: {total_lines}\n")
            if malformed_lines > 0:
                f.write(f"Malformed lines skipped: {malformed_lines}\n")
        
        return len(matching_messages)
    
    except Exception as e:
        print(f"Error processing file: {e}")
        sys.exit(1)


def main():
    # File paths
    input_file = "_chat.txt"
    output_file = "extracted_messages.txt"
    
    print(f"Processing '{input_file}'...")
    print(f"Searching for messages containing 'time' (standalone word, case-insensitive)...")
    
    num_messages = extract_time_messages(input_file, output_file)
    
    print(f"\n✓ Successfully extracted {num_messages} messages")
    print(f"✓ Results saved to '{output_file}'")


if __name__ == "__main__":
    main()
