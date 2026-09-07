import type { ToolDefinition } from "../types";

export const chmodCalculator: ToolDefinition = {
  slug: "chmod-calculator",
  category: "developer",
  name: "Chmod Calculator",
  shortDescription: "Chmod calculator: tick permissions to get octal, symbolic and the chmod command.",
  keywords: [
    "chmod calculator",
    "chmod 755",
    "chmod 644",
    "linux file permissions",
    "chmod permissions calculator",
    "octal permissions",
    "chmod command generator",
    "unix permissions calculator",
    "rwx to octal",
    "chmod 777",
    "setuid setgid sticky bit",
    "file permission calculator",
  ],
  related: ["cron-expression-generator", "base64", "hash-generator"],
  icon: "755",
  popular: false,
  content: {
    en: {
      title: "Chmod Calculator: Octal & Symbolic Permissions",
      description:
        "Chmod calculator that converts Linux file permissions between checkboxes, octal such as 755 and symbolic rwxr-xr-x, with setuid, setgid and sticky bits.",
      intro: [
        "This chmod calculator turns the Linux and macOS permission model into a grid you can click. Tick read, write and execute for the owner, the group and everyone else, and the tool shows the octal number such as 755, the symbolic string such as rwxr-xr-x and a ready to paste chmod command. Typing into either text field works the other way and updates the checkboxes, so you can decode a value from ls -l as easily as you can build one. It runs entirely in your browser with no upload.",
        "The special bits are included too. Setuid, setgid and the sticky bit add a fourth leading digit and turn the execute position into s or t, which is the part most people look up every time. The reference table lists the values you will actually use, from 644 for a config file to 700 for a private key directory, with a warning on why 777 should almost never appear on a server.",
        "Use it when a web server returns 403 Forbidden, when git reports a mode change you did not intend, or when a deployment script needs a chmod 640 that does what you think.",
      ],
      howTo: [
        "Tick Read, Write and Execute for Owner, Group and Others.",
        "Or type an octal value such as 755 into the Octal box, or rwxr-xr-x into the Symbolic box; the grid updates instantly.",
        "Tick Setuid, Setgid or Sticky for a special bit; the octal value gains a leading digit.",
        "Edit the Target box so the command names your file or directory.",
        "Click Copy command to copy the finished chmod line.",
        "Click Use on any row of the Common permissions table to load it.",
      ],
      features: [
        "3 by 3 permission grid for Owner, Group and Others",
        "Two way sync between checkboxes, octal and symbolic notation",
        "Setuid, setgid and sticky bits with four digit octal output",
        "Ready to copy chmod command with an editable target name",
        "Validation of typed octal and symbolic values",
        "Reference table of common modes from 600 to 777 with use cases",
        "Warning whenever the mode is world writable",
        "Runs in the browser, works offline",
      ],
      faq: [
        {
          question: "What do the three digits in chmod 755 mean?",
          answer:
            "Each digit is the sum of read (4), write (2) and execute (1) for one class of user: the first digit is the owner, the second the group and the third everyone else. So 755 gives the owner 4+2+1, full control, while the group and others get 4+1, read and execute but not write. Written symbolically, 755 is rwxr-xr-x.",
        },
        {
          question: "What is the difference between 755 and 644?",
          answer:
            "755 includes the execute bit for everyone, so it is the usual choice for directories, scripts and binaries; without execute you cannot enter a directory or run a program. 644 drops execute for all three classes and is the normal mode for regular files such as HTML, images and configuration, which nobody runs. Most web hosts expect directories at 755 and files at 644.",
        },
        {
          question: "Why is chmod 777 dangerous?",
          answer:
            "777 lets every user on the system, including a compromised web process, read, modify and execute the file or replace anything inside the directory. It is often used as a quick fix for a permission error, but that hides the real problem, which is usually the wrong owner. Prefer chown to the correct user with 755 or 644, and reserve 777 for throwaway sandboxes.",
        },
        {
          question: "What are setuid, setgid and the sticky bit?",
          answer:
            "They are a fourth, leading octal digit: 4 for setuid, 2 for setgid and 1 for sticky. Setuid runs an executable with the owner's privileges, which is how passwd can edit a root owned file. Setgid on a directory makes new files inherit the directory's group, useful for shared project folders. The sticky bit on a directory such as /tmp means only a file's owner can delete it.",
        },
        {
          question: "How do I read the permissions shown by ls -l?",
          answer:
            "ls -l prints a ten character string. The first character is the file type: d for directory, l for symlink, a dash for a regular file. The next nine are three rwx groups for owner, group and others. A dash means the bit is off; s or t in an execute slot means the special bit is set along with execute, while a capital S or T means it is set without execute.",
        },
        {
          question: "What is the difference between chmod 755 and chmod u=rwx,go=rx?",
          answer:
            "Nothing in the result; they are two notations for the same mode. The octal form sets all nine bits at once, which is predictable in scripts. The symbolic form can also add or remove single bits without touching the rest: chmod +x script.sh adds execute for everyone and chmod g-w file removes write for the group. Use symbolic for a relative change and octal for an exact state.",
        },
        {
          question: "Does chmod work on Windows or on files inside Git?",
          answer:
            "NTFS uses access control lists rather than rwx bits, so chmod is not native on Windows, although WSL, Git Bash and Cygwin emulate it. Git stores only one bit, whether a file is executable, as mode 100755 or 100644. If git shows a mode change you did not make, check the core.fileMode setting, which tells git to ignore permission changes the file system cannot store.",
        },
      ],
    },
  },
};
