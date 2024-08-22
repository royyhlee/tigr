package main

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetLocalBranches(path string) string {
	cmd := exec.Command("git", "branch")
	cmd.Dir = path

	out, err := cmd.Output();
	if err != nil {
		return fmt.Sprintf("Error: %s", err)
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "No branches"
	}

	return output
}

func (a *App) CheckoutBranch(branch string, path string) string {
	cmd := exec.Command("git", "checkout", branch)
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "Success"
	}

	return output
}

func (a *App) FetchAllPrune(path string) string {
	cmd := exec.Command("git", "fetch", "-a", "--prune")
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "Success"
	}

	return output
}

func (a *App) Suspend(path string) string {
	cmd := exec.Command("git", "status", "--porcelain")
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "No changes to commit"
	} 

	cmd = exec.Command("git", "add", "-A")
	cmd.Dir = path

	out, err = cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	cmd = exec.Command("git", "commit", "-am", "WIP")
	cmd.Dir = path

	out, err = cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	if output == "" {
		return "Success"
	}

	return output
}

func (a *App) Status(path string) string {
	cmd := exec.Command("git", "status", "--porcelain")
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "Clean working directory"
	}

	return output
}

func (a *App) ResetHead(path string) string {
	cmd := exec.Command("git", "reset", "HEAD~")
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "Success"
	}

	return output
}

func (a *App) Log(path string) string {
	cmd := exec.Command("git", "log", "--oneline")
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "Success"
	}

	return output
}

func (a *App) Pull(path string) string {
	cmd := exec.Command("git", "pull")
	cmd.Dir = path

	out, err := cmd.CombinedOutput();
	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + string(out))
		return "Failed"
	}

	output := strings.TrimSpace(string(out))
	if output == "" {
		return "Success"
	}

	return output
}
