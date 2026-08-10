# Read the file
with open('lib/data.ts', 'r') as f:
    content = f.read()

# Find the second CAMPUS_VENUES definition and remove it along with the duplicate interface
# The second interface starts around line 700, and the second CAMPUS_VENUES at line 708
# We need to remove from "export interface CampusVenue {" at line 700 to "} as const" at line 829

# Find the second "export interface CampusVenue {"
first_interface = content.find('export interface CampusVenue {')
second_interface = content.find('export interface CampusVenue {', first_interface + 1)

if second_interface == -1:
    print("Second interface not found")
    exit(1)

# Find the end of the second CAMPUS_VENUES (the "} as const" after it)
end_idx = content.find('} as const', second_interface)
if end_idx == -1:
    print("End of second CAMPUS_VENUES not found")
    exit(1)

# Find the end of the statement (newline after "} as const")
end_idx = content.find('\n', end_idx + 10)
if end_idx == -1:
    print("End of line not found")
    exit(1)

# Remove the duplicate section
new_content = content[:second_interface] + content[end_idx+1:]

# Also need to remove the duplicate interface definition at line 700
# The second interface is at line 700, but we already found it at second_interface
# We need to remove from "export interface CampusVenue {" to the end of the second CAMPUS_VENUES

# Actually, we need to remove from the second "export interface CampusVenue {" to the "} as const" after the second CAMPUS_VENUES
# Let's find the second "export interface CampusVenue {" more precisely

# Let's find all occurrences
import re
matches = list(re.finditer(r'export interface CampusVenue\s*\{', content))
if len(matches) >= 2:
    second_start = matches[1].start()
    # Find the end of the second CAMPUS_VENUES
    second_cves_start = content.find('export const CAMPUS_VENUES:', second_start)
    if second_cves_start != -1:
        end_idx = content.find('} as const', second_cves_start)
        if end_idx != -1:
            end_idx = content.find('\n', end_idx + 10)
            if end_idx != -1:
                # Remove from second_start to end_idx+1
                new_content = content[:second_start] + content[end_idx+1:]
                
                with open('lib/data.ts', 'w') as f:
                    f.write(new_content)
                print("Done removing duplicate")
            else:
                print("Could not find end of second CAMPUS_VENUES")
        else:
            print("Could not find second CAMPUS_VENUES")
else:
    print("Could not find second interface")

print("Done")