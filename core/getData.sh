#!/bin/bash

# Get the function name and text file from the command line arguments
function_name=$1
text_file=$2

# Define your function here
$function_name() {
  echo "Running $function_name with argument $1"
  # Execute your code with the argument here
}

# Read each line of the text file and pass it as an argument to the specified function
while read line; do
  python3 $function_name "$line"
done < $text_file
