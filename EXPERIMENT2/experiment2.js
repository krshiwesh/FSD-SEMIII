import fs from 'fs';
fs.writeFile('example.txt', 'Hello World!', (err) => {
    if (err) throw err;
    console.log('File created successfully.');
    fs.readFile('example.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log('File content:', data);
        fs.writeFile(
            'example.txt',
            'This is the updated content.',
            (err) => {
                if (err) throw err;
                console.log('File updated successfully.');
                fs.unlink('example.txt', (err) => {
                    if (err) throw err;
                    console.log('File deleted successfully.');
                });
            }

        );
    });
});
