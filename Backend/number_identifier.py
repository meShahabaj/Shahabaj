import numpy as np

data = np.load("./Utils/MNIST_Weights.npz")

W1 = data["W1"]
W2 = data["W2"]
b1 = data["b1"]
b2 = data["b2"]

def relu(x):
    return np.maximum(0, x)

def softmax(z):
    if z.ndim == 1:
        z = z.reshape(1, -1)
    exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
    return exp_z / np.sum(exp_z, axis=1, keepdims=True)


def relu_derivatives(x):
    return (x > 0).astype(float)

def forward(X):
    Z1 = X.dot(W1) + b1
    A1 = relu(Z1)

    Z2 = A1.dot(W2) + b2
    A2 = softmax(Z2)

    return A1, A2, Z1, Z2