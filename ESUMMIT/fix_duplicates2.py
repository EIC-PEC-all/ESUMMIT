# Read the file
with open('lib/data.ts', 'r') as f:
    content = f.read()

# We need to remove the duplicate definitions from lines 697-826
# The second CampusVenue interface is at line 697
# The second CAMPUS_VENUES starts at line 705 and ends at line 826 (} as const)

# Find the second "export interface CampusVenue {"
import re
matches = list(re.finditer(r'export interface CampusVenue\s*\{', content))
if len(matches) >= 2:
    second_start = matches[1].start()
    # Find the end of the second CAMPUS_VENUES (the "} as const" after it)
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